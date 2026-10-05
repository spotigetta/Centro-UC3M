
# Ejercicio tipo 1: estructuras articuladas

## Qué suelen pedir

1. Reacciones.
    
2. Axiles en las barras.
    
3. Desplazamiento de un nudo.
    
4. Giro de una barra.
    
5. Temperatura necesaria para anular desplazamientos.
    
6. Cable que deje de trabajar.
    

---

## Paso 1. Comprobar el grado de hiperestatismo

Tus apuntes usan:

[  
GH=b+r-2n  
]

donde:

- (b): barras
    
- (r): reacciones
    
- (n): nudos
    

Interpretación:

[  
GH=0  
]

isostática

[  
GH>0  
]

hiperestática

[  
GH<0  
]

mecanismo

Aparece varias veces en las hojas.

---

## Paso 2. Reacciones

Siempre equilibrio global:

[  
\sum F_x=0  
]

[  
\sum F_y=0  
]

[  
\sum M=0  
]

---

## Paso 3. Simplificaciones rápidas

Tus apuntes tienen una colección de reglas que suelen ahorrar muchísimo tiempo:

### Nudo con dos barras no colineales sin carga

Las dos barras:

[  
N=0  
]

### Nudo con tres barras y dos colineales

La tercera:

[  
N=0  
]

### Simetría geométrica

Si la carga también es simétrica:

[  
N_i=N_j  
]

Estas reglas aparecen en la hoja de Castigliano y cerchas.

---

## Paso 4. Esfuerzos

Método de nudos.

Empiezas por el nudo con menos incógnitas.

Convención:

- tracción → positivo
    
- compresión → negativo
    

---

## Paso 5. Desplazamientos

Éste es el núcleo de la asignatura.

### Método de la carga unitaria

Calculas:

#### Sistema real

[  
N_i  
]

#### Sistema virtual

Aplicas una carga unidad en la dirección del desplazamiento buscado.

Obtienes:

[  
N_i^*  
]

Entonces:

# [  
\delta

\sum  
\frac{N_i N_i^* L_i}{EA_i}  
]

Aparece exactamente en tus apuntes.

---

## Paso 6. Temperatura

Si la barra tiene temperatura uniforme:

[  
\Delta L=\alpha \Delta T L  
]

La contribución al desplazamiento es:

# [  
\delta_T

\sum N_i^*  
\alpha \Delta T_i L_i  
]

También aparece explícitamente.

---

# Ejercicio tipo 2: estructuras intraslacionales

Éste es el ejercicio donde más puntos suele perder la gente.

---

## Paso 1. Clasificación

Lo primero:

### ¿Traslacional o intraslacional?

Con rigidez axial infinita:

- si los nudos no pueden desplazarse → intraslacional
    
- si existe desplazamiento lateral → traslacional
    

Nunca empieces a calcular sin decidir esto.

---

## Paso 2. Simplificación

Tus apuntes usan exactamente lo que hablamos antes:

Separar las barras.

En cada unión rígida:

- aparece un momento nodal
    

[  
M_1,M_2,M_3  
]

y

[  
\theta_1=\theta_2=\theta_3  
]

porque es el mismo nudo.

Lo tienes dibujado en la hoja de estructuras intraslacionales.

---

## Paso 3. Compatibilidad de giro

Ésta suele ser la ecuación principal.

Para un mismo nudo:

# [  
\theta_{B1}

# \theta_{B2}

\theta_{B3}  
]

---

## Paso 4. Equilibrio del nudo

Si llegan tres barras:

[  
M_1+M_2+M_3=0  
]

No se reparte en tercios.

Nunca.

Solo equilibrio.

Esto coincide exactamente con tu esquema.

---

## Paso 5. Giros

Aquí aparece Mohr.

Tus apuntes usan:

# [  
\theta_B-\theta_A

\int  
\frac{M}{EI}  
,ds  
]

---

## Paso 6. Temperatura

### Temperatura uniforme

Produce axil:

[  
N_T=EA\alpha\Delta T  
]

si la barra está impedida.

---

### Gradiente térmico

Produce curvatura.

Tus apuntes tienen:

# [  
M_T

EI\alpha  
\frac{\Delta T_1-\Delta T_2}{c}  
]

donde (c) es el canto.

---

## Paso 7. Diagrama de flectores

Regla de examen:

### Sin carga

Recta.

### Carga puntual

Tramos lineales.

### Carga uniforme

Parábola.

### Rótula

[  
M=0  
]

### Nudo rígido

Momento igual al calculado en el nudo.

---

# Ejercicio tipo 3: análisis matricial

Aquí hay un algoritmo fijo.

---

## Paso 1. Numerar grados de libertad

Para pórtico plano:

[  
u  
]

[  
v  
]

[  
\theta  
]

por nudo.

---

## Paso 2. Matriz local

En tus apuntes aparecen las matrices completas de pórtico plano.

Debes saber:

- axial → (EA/L)
    
- flexión → (EI/L^3)
    

---

## Paso 3. Transformación

Con:

[  
c=\cos\theta  
]

[  
s=\sin\theta  
]

matriz:

[  
T  
]

Tus apuntes tienen el esquema completo.

---

## Paso 4. Ensamblar

Construyes:

[  
K  
]

global.

---

## Paso 5. Aplicar apoyos

Eliminas:

- desplazamientos conocidos
    
- giros conocidos
    

---

## Paso 6. Resolver

[  
K_r d_r = F_r  
]

---

## Paso 7. Recuperar esfuerzos

[  
S = K_e d_e  
]

como aparece en tus hojas matriciales.

---

# Lo que más se repite en tus exámenes

Por las imágenes que has subido y por tus apuntes, si tuviera que priorizar estudio:

### Nivel 1 (imprescindible)

- Método de nudos.
    
- Carga unitaria.
    
- Castigliano.
    
- Compatibilidad.
    
- Giros en estructuras intraslacionales.
    
- Diagramas de momentos.
    

### Nivel 2

- Temperatura uniforme.
    
- Gradiente térmico.
    
- Cables.
    

### Nivel 3

- Matriz global.
    
- Transformación local-global.
    
- Recuperación de esfuerzos.
    

Si dominas esos tres bloques, cubres prácticamente todos los modelos de examen que has mostrado.