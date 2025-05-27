FROM python:3.9-slim

WORKDIR /app

COPY src/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 5000

CMD ["/wait-for-it.sh", "db:3306", "--", "python", "app.py"]