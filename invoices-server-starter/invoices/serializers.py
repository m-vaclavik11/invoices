from rest_framework import serializers
from .models import Person, Invoice


class PersonSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    identificationNumber = serializers.CharField(default=None)

    class Meta:
        model = Person
        fields = [
            'name', 'identificationNumber', 'taxNumber', 'accountNumber',
            'bankCode', 'iban', 'telephone', 'mail', 'street', 'zip',
            'city', 'country', 'note', '_id'
        ]
class InvoiceSerializer(serializers.ModelSerializer):
    """
    Serializér pro model Invoice/faktura
    """
    _id = serializers.IntegerField(source='id', read_only=True) # Spárování _id, se kterým pracuje React, s id v Django modelu
    # id je zároveň rread-only, protože ho model generuje automaticky. Nechceme, aby id mohl někdo upravovat
    invoiceNumber = serializers.IntegerField() # Hříchy z minulosti - zajistí explicitně, že říslo faktury není jen read-only
    seller = serializers.PrimaryKeyRelatedField(queryset=Person.objects.filter(hidden=False)) #??? Proč to tady musí být
    buyer = serializers.PrimaryKeyRelatedField(queryset=Person.objects.filter(hidden=False)) #???

    class Meta:
        model = Invoice
        fields = ['invoiceNumber', 'seller', 'buyer', 'issued', 'dueDate', 'product', 'price', 'vat', 'note', '_id']

    def to_internal_value(self, data):
        """
        description:Zpracuje vstupní hodnoty požadavku tak, aby bylo možné použít slovník při zadání objednatele/dodavatele
        (buyer/seller)
        return: vstupní data
        """

        if isinstance(data.get('seller'), dict) and '_id' in data['seller']:
            data['seller'] = data['seller']['_id']
        if isinstance(data.get('buyer'), dict) and '_id' in data['buyer']:
            data['buyer'] = data['buyer']['_id']

        return super().to_internal_value(data)

    def to_representation(self, instance):
        """
        description:Zpracuje výstupní hodnoty v odpověďi tak, aby objekt objednatele a dodavatele byl vypsán se všemi atributy.
        return: Výstupní data, která budou v odpovědi/respond
        """
        data = super().to_representation(instance)

        data['seller'] = PersonSerializer(instance.seller).data
        data['buyer'] = PersonSerializer(instance.buyer).data

        return data

class PersonStatisticsSerializer(serializers.ModelSerializer):
    personID = serializers.IntegerField(source="id")
    personName = serializers.CharField(source="name")
    revenue = serializers.IntegerField()

    class Meta:
        model = Person
        fields = ["personID", "personName", "revenue"]