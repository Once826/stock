from django.db import models

class IndexData(models.Model):
    ticker = models.CharField(max_length=10)
    date = models.DateField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.IntegerField()

    class Meta:
        ordering = ['-date']
        unique_together = ['ticker', 'date']

class ForexData(models.Model):
    pair = models.CharField(max_length=10)
    date = models.DateField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.IntegerField()

    class Meta:
        ordering = ['-date']
        unique_together = ['pair', 'date']
