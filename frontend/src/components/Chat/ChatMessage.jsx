import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Tree } from "primereact/tree";
import { Parser } from "@json2csv/plainjs";
import {
  IconFileTypeSvg,
  IconFileTypeCsv,
  IconFileDescription,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import "./css/ChatMessage.css";
import BpmnRender from "./BpmnRender";
import LoadingMessage from "./LoadingMessage";

// Function to flatten tree data structure into a list of rows with key and label
const flattenTreeData = (node, parentKey = "") => {
  const rows = [];
  const currentKey = parentKey ? `${parentKey} > ${node.label}` : node.label;

  rows.push({ key: node.key, label: currentKey });

  if (node.children) {
    node.children.forEach((child) => {
      rows.push(...flattenTreeData(child, currentKey));
    });
  }
  return rows;
};

// ChatMessage component to display different types of messages
const ChatMessage = ({ message, isUser, isLoading, showBubble }) => {
  const bpmnRenderRef = useRef(null); // Reference to BpmnRender component

  // Function to handle CSV download
  const handleDownloadCsv = () => {
    try {
      const flattenedData = flattenTreeData(message.content[0]); // Flatten the tree data
      const fields = ["key", "label"];
      const parser = new Parser({ fields });
      const csv = parser.parse(flattenedData); // Convert JSON to CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error converting JSON to CSV:", error);
    }
  };

  // Function to handle SVG download
  const handleDownloadSvg = () => {
    if (bpmnRenderRef.current) {
      bpmnRenderRef.current.exportToImage(); // Call exportToImage method from BpmnRender component
    }
  };

  // Function to get file extension from filename
  const getExtension = (filename) => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop() : "Unknown";
  };

  // Function to render the message content based on its type
  const renderMessageContent = () => {
    const messagebpmn = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
             targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="CarRentalProcess" isExecutable="true">
    <startEvent id="StartEvent" name="Start"/>
    
    <!-- Tasks -->
    <task id="Task_CreateOrderForVendor" name="Create order for vendor"/>
    <task id="Task_CheckCarInventory" name="Check car inventory"/>
    <task id="Task_NotifyCustomerOfAvailability" name="Notify customer of availability"/>
    <task id="Task_MakeReservation" name="Make reservation"/>
    <task id="Task_ProcessCustomerReservationAndPaymentInformation" name="Process customer reservation and payment information"/>
    <task id="Task_ConfirmRentalAndPaymentInformation" name="Confirm rental and payment information"/>
    
    <!-- Data Objects -->
    <dataObjectReference id="Data_ReservationForm" dataObjectRef="ReservationForm" name="Reservation form"/>
    <dataObjectReference id="Data_CustomerBillingInformation" dataObjectRef="CustomerBillingInformation" name="Customer billing information"/>
    <dataObjectReference id="Data_PaymentInformation" dataObjectRef="PaymentInformation" name="Payment information"/>
    <dataObjectReference id="Data_CustomerReservation" dataObjectRef="CustomerReservation" name="Customer reservation"/>
    <dataObjectReference id="Data_Availabilities" dataObjectRef="Availabilities" name="Availabilities"/>
    <dataObjectReference id="Data_StockInformation" dataObjectRef="StockInformation" name="Stock information"/>
    <dataObjectReference id="Data_RentalConfirmation" dataObjectRef="RentalConfirmation" name="Rental confirmation"/>
    <dataObjectReference id="Data_RentalInformation" dataObjectRef="RentalInformation" name="Rental information"/>
    
    <!-- Data Stores -->
    <dataStoreReference id="DataStore_Reservations" dataStoreRef="Reservations" name="Reservations"/>
    <dataStoreReference id="DataStore_RentalCarInventory" dataStoreRef="RentalCarInventory" name="Rental car inventory"/>
    
    <!-- Sequence Flows -->
    <sequenceFlow id="Flow_1" sourceRef="StartEvent" targetRef="Task_CreateOrderForVendor"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_CreateOrderForVendor" targetRef="Task_CheckCarInventory"/>
    <sequenceFlow id="Flow_3" sourceRef="Task_CheckCarInventory" targetRef="Task_NotifyCustomerOfAvailability"/>
    <sequenceFlow id="Flow_4" sourceRef="Task_NotifyCustomerOfAvailability" targetRef="Task_MakeReservation"/>
    <sequenceFlow id="Flow_5" sourceRef="Task_MakeReservation" targetRef="Task_ProcessCustomerReservationAndPaymentInformation"/>
    <sequenceFlow id="Flow_6" sourceRef="Task_ProcessCustomerReservationAndPaymentInformation" targetRef="Task_ConfirmRentalAndPaymentInformation"/>
    <sequenceFlow id="Flow_7" sourceRef="Task_ConfirmRentalAndPaymentInformation" targetRef="EndEvent"/>
    
    <!-- End Event -->
    <endEvent id="EndEvent" name="End"/>
  </process>
  
  <!-- Participants -->
  <participant id="Participant_CarRentalCustomer" name="Car rental customer"/>
  <participant id="Participant_CarRentalVendor" name="Car rental vendor"/>
</definitions>
`;
    if (isLoading) {
      return (
        <div className="loading-message-outer">
          <LoadingMessage />
        </div>
      ); // Display loading message if loading
    }
    switch (message.type) {
      case "capabilityMap":
        return (
          <div className="message-block" style={{ minWidth: "80%" }}>
            <div className="message">
              <Tree value={[message.content][0]} style={{ fontSize: "1rem" }} />
            </div>
            <div className="message-tool-button-container">
              <Button
                className="p-button-rounded p-button-icon-only message-tool-button"
                onClick={handleDownloadCsv}
              >
                <IconFileTypeCsv
                  className="message-tool-button-icon"
                  size={20}
                />
              </Button>
            </div>
          </div>
        );
      case "bpmnWithPreText":
        return (
          <div className="message-block" style={{ width: "100%" }}>
            <div className="message" style={{ width: "100%" }}>
              <div
                className="message-bpmn-text-pre-content"
                style={{ marginBottom: "10px" }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    message.preContent.replace(/\n/g, "<br />")
                  ),
                }}
              />
              <BpmnRender ref={bpmnRenderRef} bpmnXML={message.bpmn} />{" "}
              {/* Render BPMN diagram */}
              <div
                className="message-bpmn-text-tail-content"
                style={{ marginTop: "10px" }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    message.tailContent.replace(/\n/g, "<br />")
                  ),
                }}
              />
            </div>
            <div className="message-tool-button-container">
              <Button
                className="p-button-rounded p-button-icon-only message-tool-button"
                onClick={handleDownloadSvg}
              >
                <IconFileTypeSvg
                  className="message-tool-button-icon"
                  size={20}
                />
              </Button>
            </div>
          </div>
        );
      case "file":
      case "fileWithText":
        const extension = getExtension(message.file.name); // Get file extension
        return (
          <div className="message" style={{ minWidth: "30%" }}>
            <div className="message-file-block">
              <IconFileDescription
                className="message-file-block-icon"
                size={35}
              />
              <div className="message-file-block-file-info">
                <div className="message-file-block-filename">
                  {message.file.name}
                </div>
                <div className="message-file-block-file-ext">
                  {extension.toUpperCase()}
                </div>
              </div>
            </div>
            {message.content && (
              <div
                className="message-file-block-text-content"
                style={{ marginTop: "10px" }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    message.content.replace(/\n/g, "<br />")
                  ),
                }}
              />
            )}
          </div>
        );
      default:
        const sanitizedContent = DOMPurify.sanitize(
          message.content.replace(/\n/g, "<br />")
        );
        return (
          <div
            className="message"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        );
    }
  };

  return (
    <div
      className={`message-container ${isUser ? "user" : "other"} ${
        showBubble ? "bubble" : ""
      }`}
    >
      {!isUser && (
        <div className="message-avatar-container">
          <Avatar
            icon="pi pi-microchip-ai"
            shape="circle"
            className="message-avatar"
          />
        </div>
      )}
      {renderMessageContent()}
    </div>
  );
};

export default ChatMessage;
