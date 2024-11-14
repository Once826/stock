import yfinance as yf
from .models import IndexData, ForexData

def preload_data(sender, **kwargs):
    indices = ['^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX', '^FTSE', '^N225', '^HSI', '^GDAXI', '^FCHI', '^IBEX', '^BSESN', '^BVSP', '^AORD', '^AXJO', '^SSEC', '^TWII', '^JKSE', '^KLSE', '^KS11', '^NZ50', '^STI', '^TASI', '^ATX', '^BFX', '^BVL', '^OMXC20', '^OMXHPI', '^OMXSPI', '^OSEAX', '^PSI20']
    forex_pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'EURJPY', 'GBPJPY', 'EURGBP', 'EURCHF', 'EURCAD', 'AUDJPY', 'CADJPY', 'NZDJPY', 'GBPCAD', 'GBPAUD']

    for index_ticker in indices:
        stock = yf.Ticker(index_ticker)
        data = stock.history(period="1d", interval="1d")
        for date, values in data.iterrows():
            IndexData.objects.get_or_create(
                ticker=index_ticker,
                date=date,
                defaults={
                    'open': values["Open"],
                    'high': values["High"],
                    'low': values["Low"],
                    'close': values["Close"],
                    'volume': values["Volume"]
                }
            )

    for forex_pair in forex_pairs:
        forex_ticker = f"{forex_pair}=X"
        stock = yf.Ticker(forex_ticker)
        data = stock.history(period="1d", interval="1d")
        for date, values in data.iterrows():
            ForexData.objects.get_or_create(
                pair=forex_pair,
                date=date,
                defaults={
                    'open': values["Open"],
                    'high': values["High"],
                    'low': values["Low"],
                    'close': values["Close"],
                    'volume': values["Volume"]
                }
            )