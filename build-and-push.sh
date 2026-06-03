#!/bin/bash

# Script para construir y hacer push de las imágenes Docker
# Uso: ./build-and-push.sh tu-registry.com [version]

set -e

REGISTRY=$1
VERSION=${2:-latest}

if [ -z "$REGISTRY" ]; then
    echo "Error: Se requiere el nombre del registry"
    echo "Uso: ./build-and-push.sh tu-registry.com [version]"
    exit 1
fi

echo "=== Build y Push de Imágenes Docker ==="
echo "Registry: $REGISTRY"
echo "Versión: $VERSION"
echo ""

# Función para construir y hacer push de una imagen
build_push_image() {
    local path=$1
    local image_name=$2
    
    echo "Construyendo imagen: $image_name"
    local full_image_name="${REGISTRY}/${image_name}:${VERSION}"
    
    docker build -t "$full_image_name" "$path"
    
    echo "Haciendo push de imagen: $full_image_name"
    docker push "$full_image_name"
    
    echo "✓ $image_name completado"
    echo ""
}

# Login al registry (si es necesario)
echo "Verificando login a Docker registry..."
# docker login "$REGISTRY"  # Descomentar si requiere autenticación

# Construir y hacer push de cada microservicio
build_push_image "./MS-gateway" "fitlife-ms-gateway"
build_push_image "./MS-usuarios" "fitlife-ms-usuarios"
build_push_image "./MS-reservas" "fitlife-ms-reservas"
build_push_image "./MS-gestionPago" "fitlife-ms-gestion-pago"
build_push_image "./MS-notificaciones" "fitlife-ms-notificaciones"
build_push_image "./MS-Location" "fitlife-ms-location"

# Construir y hacer push del frontend
build_push_image "./FitlifeFront-Front/FitlifeFront-Front_version_2.7" "fitlife-frontend"

echo ""
echo "✓ Todas las imágenes han sido construidas y push exitosamente!"
echo "Versión: $VERSION"
echo "Registry: $REGISTRY"
