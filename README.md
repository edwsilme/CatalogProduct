# Proyecto Backend - CatalogProductApp

Aplicación Backend para gestión de productos (prueba técnica).  
Incluye **backend en .NET 8.0**.

---

## 🚀 Tecnologías y Herramientas utilizadas

- C# - .Net Core - Framework .Net8
- VisualStudio 2022
- REST API (simulada o real)
---

## 🛠️ Características del sistema

* **Gestión de Productos (CRUD):** Creación, edición, listado y eliminación (lógica/física) de productos.
* **Gestión de Categorías:** Control total sobre las categorías del catálogo.
* **Búsqueda Avanzada:** Filtros dinámicos por Nombre de producto y SKU con actualización en tiempo real.
* **Diseño Responsivo:** Adaptado para dispositivos móviles, tablets y escritorio mediante *breakpoints* de Ant Design.
* **Interfaz Profesional:** Uso de componentes de Ant Design para tablas, modales, formularios y notificaciones.
* **Seguridad y Validación:** Formularios con validación en tiempo real y manejo de errores asíncronos.

---


## 📂 Estructura del proyecto

/CatalogProduct
	|- CatalogApi/ # API .NET (Clean Architecture)
		|- Controllers/
		|- Data/
		|- DTOs/
		|- Models/
		|- Repositories/
		|- Utils/
	|- catalog-dashboard/ # Cliente en React
		|- src/ # Componentes React
	|- README.md
	
 ---
 
 
 ## ⚙️ Backend (.NET 8)

### 📌 Requisitos previos
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js] (https://nodejs.org/es)

---


### Pasos:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/edwsilme/CatalogProduct.git

2. Cambiar a Rama develop:
   ```bash
   git switch develop   
   
3.  Ejecuta el script SQLQuery_CreateTable_ProductCatalogBD.sql en tu instancia de SQL Server para crear las tablas y datos iniciales.

4.  Configurar Connection String
- Abre CatalogApi/appsettings.json.
- En DefaultConnection, reemplaza el Server por el nombre de tu servidor (ej. Server=TU_PC_NOMBRE o Server=.).
   
5. Dirijirse a la carpeta CatalogApi
   ```bash
   cd CatalogProduct/CatalogApi

6. Ejecutar la API:
   ```bash
   dotnet run --launch-profile https
   
   
## Frontend (React + Vite)

1. Dirijirse a la carpeta ManagerApi:
   ```bash
   cd catalog-dashboard

2. Instalar dependencias:
   ```bash
   npm install

3. Ejecutar desarrollo:
   ```bash
   npm run dev

---

Enlaces:

Api Swagger: https://localhost:7079/swagger/index.html
Web: http://localhost:5173


---

### 🛠️ Solución de Problemas

- Error de CORS: Si el frontend no recibe datos, asegúrate de que la URL http://localhost:5173 esté permitida en la política de CORS de Program.cs en la API.

- Certificado HTTPS: Si el navegador bloquea la API, ejecuta dotnet dev-certs https --trust en la terminal.


---

### 📸 Screenshot

:arrow_forward: Pantalla de inicio de la aplicación Swagger:<p>
<img src="https://github.com/edwsilme/raw/blob/main/img-catalogProduct/001.png" width="500">

:arrow_forward: Pantalla de inicio Dashboard:<p>
<img src="https://github.com/edwsilme/raw/blob/main/img-catalogProduct/002.png" width="500">

:arrow_forward: Pantalla menú Productos:<p>
<img src="https://github.com/edwsilme/raw/blob/main/img-catalogProduct/003.png" width="500">

:arrow_forward: Pantalla menú Categorías:<p>
<img src="https://github.com/edwsilme/raw/blob/main/img-catalogProduct/003.png" width="500">



