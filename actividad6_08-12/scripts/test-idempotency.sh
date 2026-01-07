#!/bin/bash

# Script de prueba de idempotencia
# Publica el mismo mensaje múltiples veces para demostrar idempotencia

echo "🧪 Iniciando prueba de Idempotent Consumer..."
echo ""

# Verificar que RabbitMQ esté disponible
echo "Verificando conexión a RabbitMQ..."
docker exec rabbitmq rabbitmq-diagnostics ping > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ RabbitMQ no está disponible"
  exit 1
fi
echo "✅ RabbitMQ disponible"
echo ""

# Crear una clase primero
echo "📝 Creando clase de prueba..."
CLASS_RESPONSE=$(curl -s -X POST http://localhost:3000/clases \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Clase Test Idempotencia","horario":"Test 10:00","cupo":50,"instructor":"Test"}')

echo "Respuesta: $CLASS_RESPONSE"
echo ""

# Esperar a que se procese
sleep 2

# Publicar mensaje duplicado usando RabbitMQ
MESSAGE_ID="IDEMPOTENCY-TEST-$(date +%s)"
PAYLOAD="{\"messageId\":\"$MESSAGE_ID\",\"data\":{\"claseId\":1,\"alumno\":\"Idempotency Test\",\"email\":\"idempotency@test.com\"},\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"

echo "📤 Publicando mensaje 1 (debería procesarse)..."
docker exec rabbitmq rabbitmqadmin publish \
  exchange=gym.exchange \
  routing_key=gym.class.enroll \
  payload="$PAYLOAD" \
  properties="{\"content_type\":\"application/json\",\"delivery_mode\":2}" \
  > /dev/null 2>&1

echo "Mensaje publicado con ID: $MESSAGE_ID"
echo ""

# Esperar procesamiento
echo "⏳ Esperando 3 segundos..."
sleep 3

echo "📤 Publicando mensaje 2 (DUPLICADO - debería ignorarse)..."
docker exec rabbitmq rabbitmqadmin publish \
  exchange=gym.exchange \
  routing_key=gym.class.enroll \
  payload="$PAYLOAD" \
  properties="{\"content_type\":\"application/json\",\"delivery_mode\":2}" \
  > /dev/null 2>&1

echo "Mensaje duplicado publicado"
echo ""

# Esperar procesamiento
echo "⏳ Esperando 3 segundos..."
sleep 3

echo "📤 Publicando mensaje 3 (DUPLICADO - debería ignorarse)..."
docker exec rabbitmq rabbitmqadmin publish \
  exchange=gym.exchange \
  routing_key=gym.class.enroll \
  payload="$PAYLOAD" \
  properties="{\"content_type\":\"application/json\",\"delivery_mode\":2}" \
  > /dev/null 2>&1

echo "Mensaje duplicado publicado"
echo ""

# Esperar procesamiento final
sleep 2

# Verificar logs
echo "=========================================="
echo "📋 VERIFICACIÓN DE LOGS"
echo "=========================================="
echo ""
echo "Buscando procesamiento del mensaje $MESSAGE_ID..."
echo ""

docker logs ms-inscripciones 2>&1 | grep "$MESSAGE_ID" | tail -10

echo ""
echo "=========================================="
echo "🔍 VERIFICACIÓN EN REDIS"
echo "=========================================="
echo ""

REDIS_KEY="idempotent:$MESSAGE_ID"
echo "Buscando clave: $REDIS_KEY"
REDIS_VALUE=$(docker exec redis redis-cli GET "$REDIS_KEY")

if [ -n "$REDIS_VALUE" ]; then
  echo "✅ Clave encontrada en Redis:"
  echo "$REDIS_VALUE"
  echo ""
  TTL=$(docker exec redis redis-cli TTL "$REDIS_KEY")
  echo "TTL restante: $TTL segundos (aprox. $(($TTL / 3600)) horas)"
else
  echo "❌ Clave no encontrada en Redis"
fi

echo ""
echo "=========================================="
echo "💾 VERIFICACIÓN EN BASE DE DATOS"
echo "=========================================="
echo ""

COUNT=$(docker exec postgres-inscripciones psql -U postgres -d gym_inscripciones -t -c "SELECT COUNT(*) FROM inscripciones WHERE message_id = '$MESSAGE_ID';")

echo "Inscripciones con messageId=$MESSAGE_ID: $COUNT"

if [ "$COUNT" -eq 1 ]; then
  echo "✅ ÉXITO: Solo 1 inscripción creada (idempotencia funcionando)"
else
  echo "❌ FALLO: Se crearon $COUNT inscripciones (esperaba 1)"
fi

echo ""
echo "=========================================="
echo "✅ Prueba completada"
echo "=========================================="
echo ""
echo "RESUMEN:"
echo "- Mensajes publicados: 3 (todos con el mismo messageId)"
echo "- Inscripciones creadas esperadas: 1"
echo "- Inscripciones creadas reales: $COUNT"
echo ""
echo "Para ver logs completos: docker logs ms-inscripciones"
echo "Para ver Redis: docker exec -it redis redis-cli"
echo "Para ver BD: docker exec -it postgres-inscripciones psql -U postgres -d gym_inscripciones"
