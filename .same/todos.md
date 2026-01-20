# VeaIA - Plataforma de Automatización de Contenido

## Estado Actual
- [x] Servidor de desarrollo corriendo
- [x] APIs disponibles y funcionando
- [x] Workflow n8n creado para VeaIA
- [x] API de Automation mejorada con publicación real

## APIs Disponibles

| Endpoint | Descripción |
|----------|-------------|
| `/api/v1/generate` | Genera contenido con IA (guiones, captions, hashtags) |
| `/api/v1/heygen` | Crea videos con avatar IA + background personalizado |
| `/api/v1/automation` | Publicación automática en redes sociales |

## Workflow n8n para VeaIA

Archivo: `n8n-workflow-veaia.json`

### Flujo:
1. **Configuración** → Define credenciales y tema
2. **VeaIA - Generar Contenido** → `/api/v1/generate`
3. **Blotato - Crear Video Faceless** → API de Blotato
4. **Esperar 10 min** → Procesamiento del video
5. **Video Listo?** → Verificar estado
6. **VeaIA - Publicar en Todas las Redes** → `/api/v1/automation` con `publish_multi`

### Configurar en n8n:
1. Importar `n8n-workflow-veaia.json`
2. En nodo "Configuración", cambiar:
   - `veaia_base_url`: URL de tu sitio en Netlify
   - `veaia_api_key`: Tu VORTIA_API_KEY
   - `blotato_api_key`: Tu API key de Blotato
   - IDs de cuentas de redes sociales

## Próximos Pasos
- [ ] Desplegar en Netlify
- [ ] Configurar variables de entorno en Netlify
- [ ] Probar workflow completo en n8n
- [ ] Verificar publicación en redes sociales
