Sí. La idea que tienes es buena, pero hay que corregirla para que no te líes. Para Castigliano en estructuras articuladas, no tienes que hacer “tantos estados como fuerzas hay”. Tienes que hacer:

* 1 estado real.
* 1 estado ficticio por cada desplazamiento que quieras calcular.
* 1 estado ficticio por cada redundante hiperestática que hayas eliminado.

## Castigliano en cerchas: método estándar

### 0. Fórmula base
Para estructuras articuladas:

$$\delta = \sum_i \frac{N_i n_i L_i}{EA_i}$$

Donde:
* $N_i$: axil real en la barra $i$.
* $n_i$: axil ficticio por carga unidad.
* $L_i$: longitud de la barra.
* $EA_i$: rigidez axial.

Si $EA$ es constante:

$$\delta = \frac{1}{EA} \sum_i N_i n_i L_i$$

---

### 1. Si la estructura es isostática

#### Paso 1. Resuelves la estructura real
Calculas los axiles reales:

$$N_i^0$$

por nudos o secciones.

#### Paso 2. Pones una carga unidad
Si quieres el desplazamiento vertical de un punto $P$:
* quitas las cargas reales,
* aplicas $1$ vertical en $P$,
* calculas los axiles ficticios:

$$n_i$$

#### Paso 3. Multiplicas barra a barra

$$\boxed{\delta_P = \sum_i \frac{N_i^0 n_i L_i}{EA_i}}$$

Si $EA$ es común:

$$\boxed{\delta_P = \frac{1}{EA} \sum_i N_i^0 n_i L_i}$$

Eso es todo.

---

### 2. Si la estructura es hiperestática externa
Ejemplo: sobra una reacción.

#### Paso 1. Eliminas la reacción redundante
La llamas:

$$X$$

La estructura queda isostática.

#### Paso 2. Estado 0
Cargas reales sobre la estructura isostática:

$$N_i^0$$

#### Paso 3. Estado 1
Aplicar $X=1$ en la dirección de la reacción eliminada:

$$N_i^1$$

#### Paso 4. Compatibilidad
Como esa reacción existía, el desplazamiento en esa dirección debe ser cero:

$$\delta_X = 0$$

Por Castigliano:

$$\sum_i \frac{(N_i^0+X N_i^1)N_i^1 L_i}{EA_i} = 0$$

Si $EA$ es constante:

$$\sum_i N_i^0 N_i^1 L_i + X\sum_i (N_i^1)^2 L_i = 0$$

Por tanto:

$$\boxed{X= -\frac{\sum_i N_i^0 N_i^1 L_i}{\sum_i (N_i^1)^2 L_i}}$$

---

### 3. Si la estructura es hiperestática interna
Ejemplo: sobra una barra.

#### Paso 1. Cortas la barra redundante
La fuerza de esa barra será:

$$X$$

#### Paso 2. Estado 0
Cargas reales sobre la estructura sin la barra:

$$N_i^0$$

#### Paso 3. Estado 1
Aplicas dos fuerzas unitarias opuestas en los extremos de la barra cortada, en su dirección. Obtienes:

$$N_i^1$$

#### Paso 4. Compatibilidad
La deformación relativa entre los extremos debe coincidir con la deformación de la barra eliminada. La ecuación correcta es:

$$\sum_i \frac{(N_i^0+X N_i^1)N_i^1 L_i}{EA_i} + \frac{X L_r}{EA_r} = 0$$

donde:
* $L_r$: longitud de la barra redundante cortada.
* $EA_r$: rigidez axial de esa barra.

Si todo tiene el mismo $EA$:

$$\sum_i N_i^0 N_i^1 L_i + X\sum_i (N_i^1)^2 L_i + X L_r = 0$$

Por tanto:

$$\boxed{X= -\frac{\sum_i N_i^0 N_i^1 L_i}{\sum_i (N_i^1)^2 L_i + L_r}}$$

Esta es la diferencia clave con la hiperestática externa.

---

### 4. Si hay varias redundantes
Si hay $k$ redundantes:

$$N_i = N_i^0 + X_1 N_i^1 + X_2 N_i^2 + \dots + X_k N_i^k$$

Planteas una ecuación de compatibilidad por cada redundante. Para la redundante $j$:

$$\sum_i \frac{N_i N_i^j L_i}{EA_i} = 0$$

Si la redundante es una barra cortada, añades además:

$$+ \frac{X_j L_j}{EA_j}$$

---

### 5. Tabla que debes hacer siempre

| Barra | $L_i$ | $N_i^0$ | $N_i^1$ | $N_i^0 N_i^1 L_i$ | $(N_i^1)^2 L_i$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | $L_1$ | ... | ... | ... | ... |
| 2 | $L_2$ | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |
| **Suma** | | | | $\sum N_i^0 N_i^1 L_i$ | $\sum (N_i^1)^2 L_i$ |

Luego usas:

**Desplazamiento**
$$\delta = \frac{1}{EA} \sum N_i^0 n_i L_i$$

**Redundante externa**
$$X= -\frac{\sum N_i^0 N_i^1 L_i}{\sum (N_i^1)^2 L_i}$$

**Redundante interna**
$$X= -\frac{\sum N_i^0 N_i^1 L_i}{\sum (N_i^1)^2 L_i + L_r}$$

---

### Idea clave final
No multiplicas “cualquier axil por cualquier axil”. Multiplicas siempre:

$$\boxed{\text{axil real} \times \text{axil ficticio} \times L}$$

Para desplazamientos:

$$N_i^0 \cdot n_i \cdot L_i$$

Para redundantes:

$$(N_i^0+X N_i^1)\cdot N_i^1 \cdot L_i$$

Ese es el procedimiento estándar.

# 1. Partimos de Castigliano

Para una cercha:

[  
U=\sum_i \frac{N_i^2L_i}{2EA_i}  
]

Castigliano dice:

[  
\delta_X=\frac{\partial U}{\partial X}  
]

donde (X) es la fuerza asociada al desplazamiento que quieres controlar.

---

# 2. En una hiperestática, el axil depende de (X)

Al liberar una redundante (X):

[  
N_i=N_i^0+X N_i^1  
]

donde:

- (N_i^0): axil por cargas reales.
    
- (N_i^1): axil por una carga unidad en la dirección de (X).
    
- (X N_i^1): axil producido por la redundante real (X).
    

---

# 3. Sustituyes en la energía

[  
U=  
\sum_i  
\frac{  
\left(N_i^0+X N_i^1\right)^2L_i  
}{2EA_i}  
]

---

# 4. Derivas respecto a (X)

[  
\delta_X=  
\frac{\partial U}{\partial X}  
]

Entonces:

[  
\delta_X=  
\sum_i  
\frac{L_i}{2EA_i}  
\frac{\partial}{\partial X}  
\left(N_i^0+X N_i^1\right)^2  
]

Derivada:

# [  
\frac{\partial}{\partial X}  
\left(N_i^0+X N_i^1\right)^2

2  
\left(N_i^0+X N_i^1\right)  
N_i^1  
]

Sustituyendo:

[  
\delta_X=  
\sum_i  
\frac{  
\left(N_i^0+X N_i^1\right)N_i^1L_i  
}{EA_i}  
]

---

# 5. Impones compatibilidad

Si (X) era una reacción de apoyo eliminada, ese desplazamiento estaba impedido:

[  
\delta_X=0  
]

Luego:

[  
\sum_i  
\frac{  
\left(N_i^0+X N_i^1\right)N_i^1L_i  
}{EA_i}  
=0  
]

---

# 6. Si (EA) es constante

Sacamos (EA) fuera:

[  
\frac{1}{EA}  
\sum_i  
\left(N_i^0+X N_i^1\right)N_i^1L_i  
=0  
]

Como (EA\neq0):

[  
\sum_i  
\left(N_i^0+X N_i^1\right)N_i^1L_i  
=0  
]

Desarrollas:

[  
\sum_i N_i^0N_i^1L_i  
+  
\sum_i X(N_i^1)^2L_i  
=0  
]

Como (X) no depende de la barra:

[  
\sum_i N_i^0N_i^1L_i  
+  
X\sum_i (N_i^1)^2L_i  
=0  
]

Despejas:

# [  
X\sum_i (N_i^1)^2L_i

-\sum_i N_i^0N_i^1L_i  
]

[  
\boxed{  
X=  
-\frac{  
\sum_i N_i^0N_i^1L_i  
}{  
\sum_i (N_i^1)^2L_i  
}  
}  
]

---

# Resumen mental

La fórmula sale de esta cadena:

[  
U=  
\sum  
\frac{N^2L}{2EA}  
]

[  
N=N^0+XN^1  
]

[  
\delta_X=  
\frac{\partial U}{\partial X}  
]

[  
\delta_X=0  
]

[  
X=  
-\frac{  
\sum N^0N^1L  
}{  
\sum (N^1)^2L  
}  
]

Eso es Castigliano aplicado al método de las fuerzas.