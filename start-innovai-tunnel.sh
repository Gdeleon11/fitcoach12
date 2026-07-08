#!/bin/bash

echo "=========================================================="
echo "    Iniciando puente Cloudflare (InnovAI) hacia Ollama    "
echo "=========================================================="
echo ""

# Verifica si cloudflared está instalado
if ! command -v cloudflared &> /dev/null; then
    echo "❌ Error: 'cloudflared' no está instalado."
    echo "Puedes instalarlo ejecutando: brew install cloudflare/cloudflare/cloudflared"
    exit 1
fi

# Verifica si Ollama está corriendo
if ! curl -s http://localhost:11434/api/tags &> /dev/null; then
    echo "⚠️  Advertencia: No parece que Ollama esté respondiendo en el puerto 11434."
    echo "Asegúrate de que la aplicación Ollama esté abierta en tu Mac."
    echo ""
fi

echo "Para crear un puente permanente con tu dominio InnovAI, sigue estos pasos si no lo has hecho:"
echo "1. Inicia sesión en Cloudflare:  cloudflared tunnel login"
echo "2. Crea el túnel:                cloudflared tunnel create innovai-ollama"
echo "3. Enruta el DNS a tu dominio:   cloudflared tunnel route dns innovai-ollama ai.innovai.com"
echo "4. Inicia el túnel enrutado:     cloudflared tunnel run --url http://localhost:11434 innovai-ollama"
echo ""
echo "---"
echo "Si sólo quieres un túnel rápido de prueba (Quick Tunnel) sin dominio personalizado, presiona ENTER."
echo "Se generará un enlace aleatorio de trycloudflare.com que puedes poner en Vercel."
read -p "Presiona ENTER para iniciar el Quick Tunnel, o CTRL+C para cancelar..."

cloudflared tunnel --url http://localhost:11434
