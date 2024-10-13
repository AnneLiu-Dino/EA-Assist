# Generated by Django 3.2.25 on 2024-07-24 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_prompt_is_default_prompt_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='PromptGroup',
            fields=[
                ('group_id', models.AutoField(primary_key=True, serialize=False)),
                ('group_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.DeleteModel(
            name='Item',
        ),
        migrations.AddField(
            model_name='prompt',
            name='group',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='prompt',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
