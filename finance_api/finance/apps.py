from django.apps import AppConfig
from django.db.models.signals import post_migrate


class FinanceConfig(AppConfig):
    name = 'finance'

    def ready(self):
        from .utils import preload_data
        post_migrate.connect(preload_data, sender=self)
