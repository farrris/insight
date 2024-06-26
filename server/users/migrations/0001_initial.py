# Generated by Django 5.0.3 on 2024-03-21 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('interests', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(unique=True)),
                ('password', models.CharField()),
                ('is_superuser', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('city', models.CharField()),
                ('age', models.IntegerField()),
                ('gender', models.CharField(choices=[('Мужской', 'Male'), ('Женский', 'Female')])),
                ('family_status', models.CharField(choices=[('Не женат', 'Not Married'), ('Женат', 'Married'), ('Влюблён', 'In Love'), ('Встречается', 'Dating'), ('В активном поиске', 'In Search'), ('Всё сложно', 'Complicated')])),
                ('registered_at', models.DateTimeField(auto_now_add=True)),
                ('interests', models.ManyToManyField(to='interests.interest')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
