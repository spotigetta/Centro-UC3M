Para la selección dependerá de las características operativas que debe cumplir: presiones de trabajo, temperaturas, características de compatibilidad, etc… Una vez seleccionado su cálculo dependerá de los mecanismos de trasferencia y de la disposición de los fluido
![[Pasted image 20251112114034.png]]
![[Pasted image 20251112121956.png]]

![[Pasted image 20251223120022.png]]
![[Pasted image 20251223120045.png]]

![[Pasted image 20251223120127.png]]

![[Pasted image 20251223120138.png]]

![[Pasted image 20251223120453.png]]![[Pasted image 20251223121130.png]]

![[Pasted image 20251223121158.png]]

![[Pasted image 20251223121218.png]]

![[Pasted image 20251223121642.png]]



# MANUAL DE RESOLUCIÓN DE EJERCICIOS

## INTERCAMBIADORES DE CALOR

---

## 1. CONCEPTOS BÁSICOS (imprescindibles)

### 1.1 Capacidad calorífica de un fluido

$$
C = \dot m\, c_p \quad [\mathrm{W/K}]
$$

* Fluido caliente: $C_h = \dot m_h c_{p,h}$
* Fluido frío: $C_c = \dot m_c c_{p,c}$

Definiciones clave:

* $C_{\min} = \min(C_h, C_c)$
* $C_{\max} = \max(C_h, C_c)$
* Relación de capacidades:

$$
R = \frac{C_{\min}}{C_{\max}}
$$

---

### 1.2 Calor intercambiado

Siempre se cumple:

$$
Q = \dot m_h c_{p,h}(T_{h,in}-T_{h,out})
$$

$$
Q = \dot m_c c_{p,c}(T_{c,out}-T_{c,in})
$$

---

## 2. MÉTODOS DE CÁLCULO: CUÁL USAR Y CUÁNDO

### Resumen rápido (muy importante)

| Lo que te piden                                     | Método                                    |
| --------------------------------------------------- | ----------------------------------------- |
| Área A conocida → temperaturas de salida            | ε–NTU o P–NTU                             |
| Temperaturas de entrada y salida conocidas → área A | ΔTlm + F                                  |
| Intercambiador no contracorriente                   | ΔTlm + F                                  |
| Caldera / gases muy calientes                       | ΔTlm + F (cuidado con condensación ácida) |

---

## 3. MÉTODO ΔT LOGARÍTMICO MEDIO (ΔTlm)

### 3.1 Caso contracorriente ideal

$$
\Delta T_{lm} =
\frac{(T_{h,in}-T_{c,out})-(T_{h,out}-T_{c,in})}
{\ln\left(\frac{T_{h,in}-T_{c,out}}{T_{h,out}-T_{c,in}}\right)}
$$

$$
Q = U A \Delta T_{lm}
$$

---

### 3.2 Otras configuraciones: factor de corrección F

$$
Q = U A F \Delta T_{lm}
$$

Aquí **NO** es contracorriente real (tubo–carcasa multipaso, flujo cruzado).

---

## 4. FACTOR DE CORRECCIÓN F (CLAVE EN EXAMEN)

### 4.1 Definiciones

$$
P = \frac{\Delta T_2}{\Delta T_{\max}}
= \frac{T_{c,out}-T_{c,in}}{T_{h,in}-T_{c,in}}
$$

$$
R = \frac{C_c}{C_h}
= \frac{(m c_p)_c}{(m c_p)_h}
= \frac{\Delta T_h}{\Delta T_c}
$$

### 4.2 Uso práctico

1. Calculas $P$ y $R$
2. Vas al **gráfico F(P,R)** correspondiente al tipo de intercambiador:
   * Tubo–carcasa tipo E, nº par de pasos
   * Flujo cruzado
3. Lees **F**
4. Usas:

$$
Q = U A F \Delta T_{lm}
$$

Criterio de diseño:

* $F \ge 0.75$ aceptable  
* $F < 0.7$ → mal diseño

---

## 5. MÉTODO DE LA EFICIENCIA (ε–NTU)

### 5.1 Definiciones

$$
\varepsilon = \frac{Q}{Q_{\max}}
\quad\text{con}\quad
Q_{\max} = C_{\min}(T_{h,in}-T_{c,in})
$$

$$
NTU = \frac{UA}{C_{\min}}
$$

### 5.2 Procedimiento típico

1. Calcula $C_h, C_c$
2. Obtén $R$
3. Calcula $NTU$
4. Usa el **gráfico ε–NTU** del intercambiador
5. Obtén $\varepsilon$
6. Calcula $Q$
7. Obtén temperaturas de salida

---

## 6. MÉTODO P–NTU (MUY USADO EN CALDERAS)

Se usa cuando:

* No conoces temperaturas de salida
* Gases de combustión
* Intercambiadores no ideales

Relación fundamental:

$$
NTU_2 = \frac{UA}{C_2}
$$

$$
\exp[(1-R)NTU] = \frac{1-RP}{1-P}
$$

Procedimiento:

1. Calcula $C_1, C_2$
2. Calcula $R$
3. Calcula $NTU$
4. En el gráfico P–NTU lees $P$
5. Obtienes temperaturas de salida

A menudo **iterativo** (muy típico en exámenes).

---

## 7. DETERMINACIÓN DEL COEFICIENTE GLOBAL U

### 7.1 Si te lo dan → úsalo directamente

### 7.2 Si no, se estima

$$
\frac{1}{U} =
\frac{1}{h_i} + R_{pared} + \frac{1}{h_o} + R_{ens}
$$

En exámenes:

* Gases: U bajo (30–80 W/m²K)
* Agua: U medio (500–1000 W/m²K)
* Condensación: U alto (800–2000 W/m²K)

---

## 8. PROBLEMAS TIPO (ESQUEMA FIJO)

### Tipo A: determinar área

1. Calcula $Q$
2. Calcula $\Delta T_{lm}$
3. Calcula $P, R$
4. Lee $F$
5. $A = \dfrac{Q}{U F \Delta T_{lm}}$

---

### Tipo B: determinar temperaturas de salida

1. Calcula $C_h, C_c$
2. Usa ε–NTU o P–NTU
3. Obtén $Q$
4. Balance energético → temperaturas

---

### Tipo C: calderas

1. Impón límite de temperatura (condensación ácida)
2. Calcula $\Delta T_{lm}$ corregido
3. Usa F
4. Calcula área mínima compatible

---

## 9. SELECCIÓN Y COSTE DE INTERCAMBIADORES

### 9.1 Selección

Depende de:

* Presión
* Ensuciamiento
* Viscosidad
* Compatibilidad química

Ejemplos:

* Fluido viscoso → tubo–carcasa
* Pequeña potencia → doble tubo
* Alta presión → tubular

---

### 9.2 Coste

Se usa la correlación:

$$
C = \exp\left[
\ln C_1 + \ln\left(\frac{C_1}{C_2}\right)
\frac{\ln\left((Q/\Delta T_m)/(Q/\Delta T_m)_1\right)}
{\ln\left((Q/\Delta T_m)_1/(Q/\Delta T_m)_2\right)}
\right]
$$

Luego:

$$
\text{Coste} = C \cdot (Q/\Delta T_m)
$$

---

## 10. ERRORES TÍPICOS DE EXAMEN

* Confundir $R$ con $C_h/C_c$ (siempre $C_{\min}/C_{\max}$)
* Usar ΔTlm sin F cuando no es contracorriente
* No comprobar condensación ácida
* Usar mal $Q_{\max}$
* No justificar selección del intercambiador

---

## 11. ESQUEMA MENTAL FINAL (memorizar)

1. Balance energético
2. Método adecuado
3. Gráfico correcto
4. Factor F o ε
5. Resultado físico coherente

---

Si quieres, el siguiente paso puede ser:

* convertir esto en **chuleta de 2 páginas**, o
* rehacerlo como **plantilla paso a paso para examen**, o
* añadir **ejemplos resueltos comentados** directamente sobre este manual.
