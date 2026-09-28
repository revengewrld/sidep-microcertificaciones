# SIDEP — Microcertificaciones

## Vista previa local

1. Instala Node.js LTS.
2. Abre esta carpeta en Visual Studio Code.
3. Instala las dependencias:

```powershell
npm.cmd install
```

4. Inicia el proyecto:

```powershell
npm.cmd run dev
```

5. Abre <http://localhost:3000>.

Si todavía no existe un archivo `.env.local`, el proyecto activa únicamente en
desarrollo un catálogo de demostración. Esto permite revisar el aspecto visual
sin revelar ni depender de credenciales privadas.

## Conexión al sistema real

Cuando el equipo comparta las credenciales, copia `.env.example` como
`.env.local` y reemplaza los valores de ejemplo. La aplicación usará entonces
PostgreSQL y la autenticación real en lugar de los datos de demostración.

El archivo `.env.local` no debe subirse al repositorio ni enviarse por mensajes.
