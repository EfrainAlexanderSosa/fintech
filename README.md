# 💳 FinTechPro 

Aplicación web full-stack de servicios financieros con **4 microservicios Spring Boot + Hibernate/JPA + MySQL + FeignClient** y frontend **Angular 17**.

---

## 🏗️ Arquitectura

```
┌────────────────────────────────────────────────────────────────────┐
│                    Frontend Angular 17  :4200                       │
│  Login | Dashboard | Usuarios | Cuentas | Transacciones | Préstamos │
└──────────┬──────────────┬──────────────┬──────────────┬────────────┘
           │              │              │              │ HttpClient
           ▼              ▼              ▼              ▼
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────────────┐
  │ ms-usuarios  │ │ ms-cuentas   │ │ ms-transacc. │ │ ms-prestamos        │
  │  :8081       │ │  :8082       │ │  :8083       │ │  :8084  ★ NUEVO ★   │
  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬────────────┘
         │                │         FeignClient│       FeignClient│
         │                │◄──────────────────┘  ┌────────────────┘
         │                │◄─────────────────────┘
         ▼                ▼              ▼              ▼
   fintech_usuarios fintech_cuentas fintech_txn   fintech_prestamos
```

### FeignClient — Comunicación entre microservicios

| Origen | → Destino | Para qué |
|---|---|---|
| **ms-transacciones** | **ms-cuentas** | Validar saldo antes de RETIRO/TRANSFERENCIA |
| **ms-prestamos** | **ms-usuarios** | Verificar que el usuario existe y está activo |
| **ms-prestamos** | **ms-cuentas** | Verificar que la cuenta es activa y pertenece al usuario |

---

## 📁 Estructura

```
fintech/
├── ms-usuarios/          ← Puerto 8081 — Auth BCrypt + CRUD usuarios
├── ms-cuentas/           ← Puerto 8082 — CRUD cuentas bancarias
├── ms-transacciones/     ← Puerto 8083 — CRUD transacciones + FeignClient → ms-cuentas
├── ms-prestamos/         ← Puerto 8084 — CRUD préstamos + FeignClient → ms-usuarios + ms-cuentas ★
├── frontend-angular/     ← Puerto 4200 — SPA Angular 17 (5 módulos)
├── database.sql          ← 4 schemas + datos semilla
└── README.md
```

---

## ⚙️ Requisitos

| Herramienta | Versión |
|---|---|
| Java JDK | 17+ |
| Maven | 3.9+ |
| MySQL | 8.0+ |
| Node.js | 18+ |
| Angular CLI | 17+ |

---

## 🚀 Arranque

```bash
# 1. Crear las 4 bases de datos
mysql -u root -p < database.sql

# 2. Cuatro terminales:
cd ms-usuarios      && mvn spring-boot:run   # :8081
cd ms-cuentas       && mvn spring-boot:run   # :8082
cd ms-transacciones && mvn spring-boot:run   # :8083
cd ms-prestamos     && mvn spring-boot:run   # :8084

# 3. Frontend
cd frontend-angular && npm install && ng serve

# Login: admin@fintech.pe / admin123
```

> ⚠️ ms-prestamos requiere que ms-usuarios (:8081) y ms-cuentas (:8082)
> estén activos — los consulta via FeignClient al crear un préstamo.

---

## 🔌 Endpoints REST

### ms-usuarios :8081
| Método | URL | Descripción |
|---|---|---|
| POST | /api/usuarios/login | Login con BCrypt |
| GET | /api/usuarios | Listar usuarios |
| GET | /api/usuarios/{id} | Buscar por ID |
| POST | /api/usuarios | Crear usuario |
| PUT | /api/usuarios/{id} | Actualizar |
| DELETE | /api/usuarios/{id} | Eliminar |

### ms-cuentas :8082
| Método | URL | Descripción |
|---|---|---|
| GET | /api/cuentas | Listar cuentas |
| GET | /api/cuentas/{id} | Buscar por ID |
| GET | /api/cuentas/usuario/{id} | Por usuario |
| POST | /api/cuentas | Crear cuenta |
| PUT | /api/cuentas/{id} | Actualizar |
| DELETE | /api/cuentas/{id} | Eliminar |

### ms-transacciones :8083
| Método | URL | Descripción |
|---|---|---|
| GET | /api/transacciones | Listar todas |
| GET | /api/transacciones/{id} | Buscar por ID |
| GET | /api/transacciones/cuenta/{id} | Por cuenta |
| POST | /api/transacciones | Nueva transacción ★ FeignClient valida saldo |
| PUT | /api/transacciones/{id} | Actualizar |
| DELETE | /api/transacciones/{id} | Eliminar |

### ms-prestamos :8084 ★ NUEVO
| Método | URL | Descripción |
|---|---|---|
| GET | /api/prestamos | Listar préstamos |
| GET | /api/prestamos/{id} | Buscar por ID |
| GET | /api/prestamos/usuario/{id} | Por usuario |
| POST | /api/prestamos | Solicitar ★ FeignClient valida usuario + cuenta |
| PUT | /api/prestamos/{id}/aprobar | Aprobar préstamo |
| PUT | /api/prestamos/{id} | Actualizar estado/tasa |
| DELETE | /api/prestamos/{id} | Eliminar |

---
