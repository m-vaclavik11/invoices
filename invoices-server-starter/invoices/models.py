from django.db import models


class Countries(models.TextChoices):
    CZECHIA = 'CZECHIA', 'Czechia'
    SLOVAKIA = 'SLOVAKIA', 'Slovakia'


class Person(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    identificationNumber = models.CharField(max_length=50, db_index=True)
    taxNumber = models.CharField(max_length=50, blank=True, null=True)
    accountNumber = models.CharField(max_length=50)
    bankCode = models.CharField(max_length=20)
    iban = models.CharField(max_length=34, blank=True, null=True)
    telephone = models.CharField(max_length=20)
    mail = models.EmailField()
    street = models.CharField(max_length=100)
    zip = models.CharField(max_length=10)
    city = models.CharField(max_length=50)
    country = models.CharField(
        max_length=10,
        choices=Countries.choices,
        default=Countries.CZECHIA
    )
    note = models.TextField(blank=True, null=True)
    hidden = models.BooleanField(default=False, db_index=True)

    objects = models.Manager()  # Aby PyCharm chápal třídu jako Django model a nehlásil chybu při Invoice.objects

class Invoice(models.Model):
    """
    Model faktury, který reprezentuje jednotlivé sloupce v databázi.
    """
    id = models.BigAutoField(primary_key=True)  # Explicitně definovaný primární klíč (tzv. tehnický primární klíč).
    # Byl definován kvůli změně původního primárního klíče přiřazeného k čísli faktury/invoiceNumber
    invoiceNumber = models.IntegerField(unique=True) # Číslo faktury chceme, aby bylo jedinečné
    seller = models.ForeignKey(Person, on_delete=models.SET_NULL, related_name='sellers_invoice', null=True)
    buyer = models.ForeignKey(Person, on_delete=models.SET_NULL, related_name='buyers_invoice', null=True)
    # Cizí klíče vytváří vazbu One to Many. Jeden dodvatel/odběratel může být na několika fakturách.
    # Pokud fakturu smažeme, nechceme, aby došlo ke smazání objektu osoby
    # Explicitně zadáno null = True kvůli on_delete.SET_NULL
    issued = models.DateField()
    dueDate = models.DateField()
    product = models.CharField(max_length=100)
    price = models.IntegerField()
    vat = models.IntegerField()
    note = models.CharField(max_length=300)

    objects = models.Manager() # Aby PyCharm chápal třídu jako Django model a nehlásil chybu při Invoice.objects




