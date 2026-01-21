# Sistema de Sorteo con Venta de Boletas

Plataforma profesional de sorteos online con venta de boletas integrada, construida con Astro y Tailwind CSS.

## Características

- **Anuncio del Proyecto**: Sección de landing para presentar el sorteo
- **Compra de Boletas**: Sistema completo de compra con formulario
- **Múltiples Métodos de Pago**: Tarjeta, Transferencia, PayPal (UI lista)
- **Sorteo Automático**: El sorteo se realiza automáticamente cuando se completa una compra
- **Estadísticas en Tiempo Real**: Boletas vendidas, total recaudado, participantes
- **Preparado para Firebase**: Estructura y comentarios listos para integración
- **Diseño Responsive**: Adaptado para todos los dispositivos

## Tecnologías

- [Astro](https://astro.build/) - Framework web moderno
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS utility-first
- [pnpm](https://pnpm.io/) - Gestor de paquetes rápido
- [Firebase](https://firebase.google.com/) - Backend (a implementar)

## Instalación

1. Instala las dependencias:

```bash
pnpm install
```

## Desarrollo

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## Build

Genera la versión de producción:

```bash
pnpm build
```

## Preview

Previsualiza la versión de producción:

```bash
pnpm preview
```

## Integración con Firebase

El proyecto está preparado para integrarse con Firebase. En el archivo `src/pages/index.astro` encontrarás:

### Estructura de Colecciones Sugeridas

1. **`compras`**: Guarda cada compra realizada
   ```javascript
   {
     nombre: string,
     email: string,
     telefono: string,
     cantidad: number,
     total: number,
     metodoPago: string,
     fecha: timestamp,
     numeroBoleta: string,
     pagado: boolean
   }
   ```

2. **`boletas`**: Guarda cada boleta individual
   ```javascript
   {
     numero: string,
     comprador: string,
     email: string,
     compraId: string,
     fecha: timestamp,
     estado: 'vendida' | 'disponible'
   }
   ```

3. **`sorteos`**: Guarda resultados de sorteos
   ```javascript
   {
     ganador: string,
     numeroBoleta: string,
     fecha: timestamp,
     compraId: string,
     premio: string
   }
   ```

4. **`estadisticas`**: Estadísticas generales
   ```javascript
   {
     boletasVendidas: number,
     totalRecaudado: number,
     totalParticipantes: number,
     totalSorteos: number
   }
   ```

### Funciones a Implementar

En el código encontrarás comentarios `TODO` indicando dónde implementar:

- `guardarCompraEnFirebase()` - Guardar compra en Firestore
- `generarBoletasEnFirebase()` - Crear boletas para una compra
- `realizarSorteoEnFirebase()` - Guardar resultado del sorteo
- Actualizar estadísticas desde Firebase

### Pasos para Integrar

1. Instala Firebase:
   ```bash
   pnpm add firebase
   ```

2. Configura Firebase en tu proyecto
3. Implementa las funciones marcadas con `TODO` en el código
4. Reemplaza las simulaciones con llamadas reales a Firebase

## Personalización

### Información del Proyecto

Puedes personalizar la información del sorteo en la sección Hero de `src/pages/index.astro`:

- Título del sorteo
- Premio principal
- Fecha del sorteo
- Precio por boleta
- Cantidad de boletas disponibles


Licencia: MIT

Autor: Fravelz

### Estilos

Los estilos están personalizables a través de Tailwind CSS. Puedes modificar los colores en `tailwind.config.mjs`.

valor 3 euros
