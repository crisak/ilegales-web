# Guia de Prompts para Trabajar con IA

> Instrucciones y plantillas para comunicarte efectivamente con Claude durante el desarrollo.

---

## Inicio de Sesion

<!-- ⭐️ FAVORITE -->
### Primera vez en el proyecto
```
Lee CLAUDE.md y docs/FEATURES.md para entender el proyecto.
Quiero comenzar a implementar [descripcion de la tarea].

- Crear una nueva rama para hacer estos cambios `main -> [feature-branch-name]`
```

### Retomar despues de tiempo
```
Retomando el proyecto. Lee docs/FEATURES.md y dime el estado actual.
Quiero continuar con [siguiente tarea].
```

<!-- ⭐️ FAVORITE -->
### Continuar sesion anterior
```
Continuamos donde lo dejamos. El ultimo cambio fue [descripcion].
Ahora quiero [siguiente paso].
```

---

## Solicitar Cambios

### Crear nueva feature
```
Quiero implementar [nombre de la feature].

Contexto:
- Pagina/componente: [donde se implementa]
- Tipo de renderizado: [SSG/SSR/ISR/CSR/Streaming]
- Objetivo de aprendizaje: [que quiero aprender con esto]

Antes de escribir codigo:
1. Lee docs/ARCHITECTURE.md para seguir la estructura
2. Lee docs/CONVENTIONS.md para seguir las convenciones
3. Recuerda agregar comentarios educativos en configuraciones de Next.js
```

### Crear componente
```
Crea el componente [NombreComponente].

Detalles:
- Tipo: [Server Component / Client Component]
- Ubicacion: [src/components/ui/ o src/components/features/]
- Props: [lista de props esperadas]
- Accesibilidad: [requisitos especificos de a11y]

Recuerda:
- Seguir convenciones de docs/CONVENTIONS.md
- Si es Client Component, justificar por que necesita 'use client'
- Incluir atributos ARIA necesarios
```

### Crear API Route
```
Crea el endpoint [GET/POST] /api/[ruta].

Detalles:
- Proposito: [que hace el endpoint]
- Parametros: [query params o body esperado]
- Respuesta: [estructura del JSON de respuesta]
- Delay simulado: [si/no, rango en ms]

Recuerda agregar comentarios explicando el proposito del endpoint.
```

### Implementar tipo de renderizado especifico
```
Implementa [SSG/ISR/SSR/Streaming/PPR] en [pagina o componente].

Objetivo de aprendizaje:
- Quiero entender como funciona [concepto especifico]
- Documenta con comentarios por que usamos esta configuracion

Referencia: docs/LEARNING_GOALS.md seccion [numero de seccion]
```

---

## Debugging y Problemas

### Reportar error
```
Tengo un error en [archivo o funcionalidad].

Error:
[pegar mensaje de error completo]

Contexto:
- Que estaba haciendo: [descripcion]
- Que esperaba que pasara: [comportamiento esperado]
- Que paso en realidad: [comportamiento actual]
```

### Pedir explicacion
```
No entiendo por que [comportamiento o codigo].

Explicame:
1. Que esta pasando
2. Por que funciona asi
3. Como se relaciona con [concepto de Next.js]

Contexto de aprendizaje: Estoy aprendiendo sobre [tema].
```

### Revisar implementacion
```
Revisa mi implementacion de [feature/componente].

Archivo(s): [rutas de archivos]

Verifica:
- [ ] Sigue las convenciones de docs/CONVENTIONS.md
- [ ] Tiene comentarios educativos donde corresponde
- [ ] Cumple con accesibilidad basica
- [ ] El tipo de renderizado es el correcto segun docs/ARCHITECTURE.md
```

---

## SEO y Accesibilidad

### Implementar SEO
```
Implementa SEO para [pagina].

Incluir:
- [ ] generateMetadata con title, description, openGraph
- [ ] JSON-LD con Schema.org/[tipo]
- [ ] Canonical URL si aplica

Referencia: docs/LEARNING_GOALS.md seccion 2 (SEO)
```

### Revisar accesibilidad
```
Revisa la accesibilidad de [componente/pagina].

Verificar:
- [ ] Semantic HTML (main, nav, article, etc.)
- [ ] ARIA labels donde sea necesario
- [ ] Alt text en imagenes
- [ ] Focus states visibles
- [ ] Navegacion por teclado

Referencia: docs/LEARNING_GOALS.md seccion 3 (Accesibilidad)
```

---

## Actualizacion de Documentacion

<!-- ⭐️ FAVORITE -->
### Marcar feature como completada
```
Acabo de completar [nombre de la feature].

Actualiza docs/FEATURES.md:
- Mueve la feature de "Pendientes" a "Implementadas"
- Agrega los archivos modificados
- Agrega notas relevantes

Tambien actualiza docs/LEARNING_GOALS.md si aprendi algo nuevo sobre [tema].
```

### Agregar nota de aprendizaje
```
Aprendi algo importante sobre [concepto].

Agrega al registro de aprendizajes en docs/LEARNING_GOALS.md:
- Fecha: [hoy]
- Concepto: [nombre del concepto]
- Que aprendi: [descripcion breve]
- Archivo de referencia: [ruta del archivo donde lo implemente]
```

---

## Plantillas Rapidas

### Pedir implementacion simple
```
Implementa [descripcion corta].
Sigue las convenciones del proyecto.
Agrega comentarios educativos donde corresponda.
```

### Pedir refactor
```
Refactoriza [archivo/componente] para [objetivo del refactor].
Mantiene la funcionalidad existente.
Sigue docs/CONVENTIONS.md.
```

### Pedir tests (futuro)
```
Crea tests para [componente/funcion].
Tipos de tests: [unit/integration/e2e]
Casos a cubrir: [lista de casos]
```

---

## Tips para Mejores Respuestas

1. **Se especifico** - Cuanto mas contexto des, mejor sera la respuesta
2. **Menciona el objetivo de aprendizaje** - Ayuda a que los comentarios sean mas relevantes
3. **Referencia la documentacion** - "Segun docs/ARCHITECTURE.md..." o "Como dice CLAUDE.md..."
4. **Pide explicaciones** - No solo codigo, tambien el "por que"
5. **Divide tareas grandes** - Una feature a la vez para mejor seguimiento
6. **Actualiza la documentacion** - Pide que se actualice FEATURES.md despues de cada cambio

---

## Comandos Utiles

| Accion | Prompt rapido |
|--------|---------------|
| Ver estado del proyecto | "Lee docs/FEATURES.md y resume el estado" |
| Ver proxima tarea | "Segun docs/FEATURES.md, cual es la siguiente tarea pendiente?" |
| Verificar convenciones | "Este codigo sigue docs/CONVENTIONS.md?" |
| Explicar renderizado | "Explica por que [pagina] usa [tipo de render]" |
| Agregar a11y | "Agrega atributos de accesibilidad a [componente]" |
