# Apuntes de calor y frío industrial


## Página 1: intercambiadores de calor

### Conceptos básicos

Capacidad calorífica de una corriente:

$$  
C = \dot m c_p  
$$

Para la corriente caliente:

$$  
C_h = \dot m_h c_{p,h}  
$$

Para la corriente fría:

$$  
C_c = \dot m_c c_{p,c}  
$$

Relación de capacidades térmicas:

$$  
C_r = \frac{C_{\min}}{C_{\max}}  
$$

En el apunte aparece escrito como:

$$  
\eta = \frac{C_{\min}}{C_{\max}}  
$$

Calor cedido por la corriente caliente:

$$  
\dot Q = \dot m_h c_{p,h}\left(T_{h,in}-T_{h,out}\right)  
$$

Calor ganado por la corriente fría:

$$  
\dot Q = \dot m_c c_{p,c}\left(T_{c,out}-T_{c,in}\right)  
$$

### Método de la diferencia de temperatura logarítmica media

Para un intercambiador en contracorriente:

$$  
\Delta T_{lm}=  
\frac{  
\left(T_{h,in}-T_{c,out}\right)-\left(T_{h,out}-T_{c,in}\right)  
}{  
\ln\left(  
\frac{T_{h,in}-T_{c,out}}{T_{h,out}-T_{c,in}}  
\right)  
}  
$$

Ecuación de transferencia de calor:

$$  
\dot Q = U A F \Delta T_{lm}  
$$

Nota: el factor de corrección F solo se aplica cuando el intercambiador no es ideal de flujo paralelo o contracorriente puro. Para esos casos ideales:

$$  
F=1  
$$

### Factor de corrección

Paso 1. Calcular P:

$$  
P=  
\frac{\Delta T_2}{\Delta T_{\max}} = 
\frac{T_{c,out}-T_{c,in}}{T_{h,in}-T_{c,in}}  
$$

Paso 2. Calcular R:

$$  
R=  
\frac{C_c}{C_h} = 
\frac{\left(\dot m c_p\right)_c}{\left(\dot m c_p\right)_h} = 
\frac{T_{h,in}-T_{h,out}}{T_{c,out}-T_{c,in}} = 
\frac{\Delta T_h}{\Delta T_c}  
$$

Paso 3. Consultar el gráfico:

$$  
F = F(P,R)  
$$

Paso 4. Usar:

$$  
\dot Q = U A F \Delta T_{lm}  
$$

Criterio anotado:

$$  
F \geq 0{,}75  
$$

Valor aceptable.

$$  
F < 0{,}75  
$$

Valor no aceptable.

### Método de la eficiencia: epsilon-NTU

Definición de eficiencia:

$$  
\varepsilon = \frac{\dot Q}{\dot Q_{\max}}  
$$

Calor máximo posible:

$$  
\dot Q_{\max}=C_{\min}\left(T_{h,in}-T_{c,in}\right)  
$$

Número de unidades de transferencia:

$$  
NTU=\frac{UA}{C_{\min}}  
$$

### Método P-NTU

Situaciones anotadas donde se usa:

- Se conoce una temperatura de salida, por ejemplo la temperatura de salida de humos.
- Intercambiador no ideal.
- Gases de combustión.

Definición anotada:

$$  
NTU_2=\frac{UA}{C_2}  
$$

Relación anotada y corregida:

$$  
e^{\left(C_r-1\right)NTU} = 
\frac{1-C_r P}{1-P}  
$$

De esta relación puede despejarse P cuando se conocen NTU y la relación de capacidades.

### Pasos de resolución para epsilon-NTU

1. Calcular:

$$  
C_h  
$$

$$  
C_c  
$$

2. Obtener:

$$  
C_{\min}  
$$

$$  
C_{\max}  
$$

$$  
C_r=\frac{C_{\min}}{C_{\max}}  
$$

3. Calcular:

$$  
NTU=\frac{UA}{C_{\min}}  
$$

4. Ir al gráfico:

$$  
\varepsilon-NTU  
$$

5. Obtener:

$$  
\varepsilon  
$$

6. Calcular:

$$  
\dot Q=\varepsilon \dot Q_{\max}  
$$

7. Obtener temperaturas finales mediante balances de energía.

### Pasos de resolución para P-NTU

1. Calcular:

$$  
C_1  
$$

$$  
C_2  
$$

2. Calcular:

$$  
R  
$$

3. Calcular:

$$  
NTU  
$$

4. Usar el sistema o gráfico:

$$  
P-NTU  
$$

5. Obtener P y calcular la temperatura desconocida.

### Coste

La expresión manuscrita corresponde a una interpolación logarítmica entre dos puntos de coste. Se corrige en forma general usando:

$$  
X=\frac{\dot Q}{\Delta T_{lm}}  
$$

Interpolación logarítmica:

$$  
C'=  
\exp\left[  
\ln C_1+  
\ln\left(\frac{C_2}{C_1}\right)  
\frac{  
\ln\left(\frac{X}{X_1}\right)  
}{  
\ln\left(\frac{X_2}{X_1}\right)  
}  
\right]  
$$

donde:

$$  
X_1=\left(\frac{\dot Q}{\Delta T_{lm}}\right)_1  
$$

$$  
X_2=\left(\frac{\dot Q}{\Delta T_{lm}}\right)_2  
$$

Coste final anotado:

$$  
Coste=C'\left(\frac{\dot Q}{\Delta T_{lm}}\right)  
$$

---



## Página 2: calderas

### Caldera estándar

Esquema transcrito:

- Entra aire por la parte superior izquierda.
- Entra combustible por el lateral izquierdo.
- Sale humo por la parte superior derecha.
- En la zona inferior interior aparece el agua.

Rendimiento de la caldera:

$$  
\eta_{cald} = 
\frac{\dot Q_{útil}}{\dot Q_{combustible}} = 
\frac{\dot Q_{útil}}{\dot m_{comb}PCI}  
$$

### Combustible

Esquema transcrito:

- Entra aire.
- Entra combustible.
- Salen humos.
- Salen cenizas, escorias o inquemados por la parte inferior.

### Agua

Esquema transcrito:

- Entra agua de reposición, con concentración:

$$  
C_0  
$$

- Entra retorno, con concentración:

$$  
C_1  
$$

- Salen posibles fugas de vapor.
- Salen posibles fugas de agua.
- Sale purga, con concentración:

$$  
C_p  
$$

En el esquema aparecen varias concentraciones marcadas como:

$$  
C_0,\ C_1,\ C_2  
$$

Algunos subíndices del dibujo son dudosos.

### Balance de energía

El esquema representa un volumen de control de caldera. Entran calor de reacción, combustible y aire; salen calor útil, humos, pérdidas y residuos.

Forma general corregida:

$$  
\dot Q_{entrada} = 
\dot Q_{útil}  
+  
\dot Q_{humos}  
+  
\dot Q_{pérdidas}  
+  
\dot Q_{cenizas}  
+  
\dot Q_{inquemados}  
$$

En el apunte aparece expresado como:

$$  
\dot Q_{reacción}  
+  
\dot Q_{comb}  
+  
\dot Q_{combustible} = 
\dot Q  
+  
\dot Q_{humos}  
+  
\dot Q_{resto}  
$$

y se indica que el conjunto de términos de entrada equivale a:

$$  
\dot Q_{comb}  
$$

### Rendimientos

#### Rendimiento de combustión

$$  
\eta_c = 
1-  
\frac{\dot Q_c+\dot Q_h}{\dot Q_{comb}}  
$$

donde:

$$  
\dot Q_c  
$$

representa pérdidas asociadas a cenizas, inquemados o residuos.

$$  
\dot Q_h  
$$

representa pérdidas por humos.

#### Rendimiento de generación instantánea

$$  
\eta_G = 
1-  
\frac{\dot Q_c+\dot Q_h+\dot Q_p}{\dot Q_{comb}}  
$$

donde:

$$  
\dot Q_p  
$$

representa pérdidas adicionales de la caldera.

#### Rendimiento de generación estacional

$$  
\eta_{GE} = 
\eta_G - 
\frac{\dot Q_{pérdidas}}{\dot Q_{comb}}  
\left(  
\frac{h_{parada}}{h_{funcionamiento}}  
\right) - 
\frac{\dot Q_{arranque}}{\dot Q_{comb}}  
\left(  
\frac{h_{arranque}}{h_{funcionamiento}}  
\right)  
$$

### Balance de masas

#### Balance de agua

Forma general según el esquema:

$$  
\dot m_{retorno}  
+  
\dot m_{reposición} = 
\dot m_{vapor}  
+  
\dot m_{fugas,vapor}  
+  
\dot m_{fugas,agua}  
+  
\dot m_{purgas}  
$$

En el manuscrito algunos términos de salida están poco legibles, pero la estructura es entrada de agua igual a salidas de vapor, fugas y purgas.

#### Balance de sales

Como el vapor idealmente no arrastra sales:

$$  
\dot m_{vapor}\cdot 0  
$$

Balance de sales corregido:

$$  
\dot m_{reposición}C_0  
+  
\dot m_{retorno}C_1 = 
\dot m_{vapor}\cdot 0  
+  
\dot m_{purga}C_p  
+  
\dot m_{fugas,agua}C_2  
$$

En una versión simplificada sin retorno ni fugas de agua:

$$  
\dot m_{reposición}C_0 = 
\dot m_{purga}C_p  
$$

Anotación final:

$$  
1\ Nm^3\ CO_2 \cdot \rho_{CO_2}=kg\ CO_2  
$$

---

## Página 3: calderas y estequiometría

### Aire estequiométrico

Relación aire-combustible estequiométrica:

$$  
AFR_{stq} = 
\left(  
\frac{\dot m_{aire}}{\dot m_{comb}}  
\right)_{stq}  
$$

Exceso de aire:

$$  
\lambda = 
\frac{  
\left(  
\frac{\dot m_{aire}}{\dot m_{comb}}  
\right)  
}{  
\left(  
\frac{\dot m_{aire}}{\dot m_{comb}}  
\right)_{stq}  
}  
$$

En el apunte aparece también como:

$$  
n=\lambda  
$$

### Composición del aire seco

En masa:

$$  
77\%\ N_2 + 23\%\ O_2  
$$

En volumen:

$$  
79\%\ N_2 + 21\%\ O_2  
$$

En moles:

$$  
3{,}76\ mol\ N_2 + 1\ mol\ O_2  
$$

### Rendimiento referido al PCI

$$  
\eta_{PCI} = 
\frac{\dot Q_{útil}}{\dot Q_{PCI}}  
$$

Anotación: referido al poder calorífico inferior.

### Combustión estequiométrica

Combustible genérico:

$$  
C_xH_yO_zS_w  
$$

Coeficiente de oxígeno estequiométrico:

$$  
a=  
x+\frac{y}{4}+w-\frac{z}{2}  
$$

Reacción estequiométrica corregida:

$$  
C_xH_yO_zS_w  
+  
a\left(O_2+3{,}76N_2\right)  
\rightarrow  
xCO_2  
+  
\frac{y}{2}H_2O  
+  
wSO_2  
+  
3{,}76aN_2  
$$

Incluyendo humedad y cenizas del combustible:

$$  
C_xH_yO_zS_w  
+  
H_2O_{humedad}  
+  
Cenizas  
+  
a\left(O_2+3{,}76N_2\right)  
\rightarrow  
xCO_2  
+  
\frac{y}{2}H_2O  
+  
wSO_2  
+  
H_2O_{humedad}  
+  
3{,}76aN_2  
+  
Cenizas  
$$

### Cálculo de x, y, z, w

Para una base de 1 kg de combustible:

$$  
n_i=  
\frac{m_i}{PM_i}  
$$

Por tanto:

$$  
x=\frac{m_C}{PM_C}  
$$

$$  
y=\frac{m_H}{PM_H}  
$$

$$  
z=\frac{m_O}{PM_O}  
$$

$$  
w=\frac{m_S}{PM_S}  
$$

Si la composición se da en porcentaje másico:

$$  
n_i=  
\frac{\%m_i/100}{PM_i}  
$$

Ejemplo anotado para el oxígeno:

$$  
PM(O)=16  
$$

Si:

$$  
\%m(O)=3\%  
$$

entonces:

$$  
z=\frac{0{,}03}{16}=1{,}875\cdot 10^{-3}\ kmol/kg_{comb}  
$$

La cifra manuscrita del porcentaje es dudosa, pero el procedimiento correcto es este.

### Relación aire-combustible

Moles de aire estequiométrico por mol de combustible:

$$  
n_{aire,stq} = 
a\left(1+3{,}76\right) = 
4{,}76a  
$$

Masa de aire estequiométrico por mol de combustible:

$$  
m_{aire,stq} = 
a\left(32+3{,}76\cdot 28\right)  
$$

Relación aire-combustible:

$$  
AFR_{stq} = 
\frac{m_{aire,stq}}{m_{comb}}  
$$

Con exceso de aire:

$$  
AFR=  
\lambda AFR_{stq}  
$$

### Temperatura adiabática de llama

Balance simplificado:

$$  
\dot m_{comb}PCI_{comb} = 
\dot m_h c_{p,h}  
\left(  
T_{ad}-T_{ref}  
\right)  
$$

También aparece escrito con caudal volumétrico de humos:

$$  
\dot m_{comb}PCI_{comb} = 
\dot V_h c_{p,h}  
\left(  
T_{ad}-T_{ref}  
\right)  
$$

Anotaciones:

- Calor específico de humos.
- Volumen de humos.
- Relación entre volumen de humos y volumen de combustible:

$$  
\frac{\dot V_h}{\dot V_{comb}}  
$$

### Fórmulas laterales

Potencia útil con combustible gaseoso:

$$  
\dot Q = 
\dot V\ PCI\ \eta  
$$

Potencia útil con combustible másico:

$$  
\dot Q = 
\dot m\ PCI\ \eta  
$$

Transferencia de calor:

$$  
\dot Q = 
UA F \Delta T  
$$

Conversión aproximada anotada:

$$  
1\ Nm^3  
\approx  
10\ kWh  
$$

### Definiciones

#### As received

Composición del combustible real, tal como se recibe:

$$  
AR  
$$

Incluye humedad y cenizas.

#### Dry ash free

Composición del combustible en base seca y libre de cenizas:

$$  
DAF  
$$

No incluye humedad ni cenizas.

#### PCI

Poder calorífico inferior: calor liberado en la combustión cuando el agua producida queda en fase vapor. No se recupera el calor latente de condensación del agua.

#### PCS

Poder calorífico superior: calor liberado en la combustión cuando el agua producida se condensa y se recupera su calor latente.

Relación conceptual:

$$  
PCS>PCI  
$$

---

## Página 4: torres de refrigeración

### Definiciones

Rango de la torre:

$$  
R_{torre} = 
T_{w,in}-T_{w,out}  
$$

Aproximación o approach:

$$  
Approach = 
T_{w,out}-T_{bh}  
$$

donde:

$$  
T_{bh}  
$$

es la temperatura de bulbo húmedo del aire exterior.

Anotación importante: usar la temperatura de bulbo húmedo y no la de bulbo seco.

### Eficiencia de la torre

$$  
\varepsilon = 
\frac{  
T_{w,in}-T_{w,out}  
}{  
T_{w,in}-T_{bh}  
}  
$$

Rango típico anotado:

$$  
\varepsilon \in \left(0{,}7,\ 0{,}85\right)  
$$

De la eficiencia se puede despejar:

$$  
T_{w,out} = 
T_{w,in} - 
\varepsilon\left(T_{w,in}-T_{bh}\right)  
$$

### Calor cedido por el agua

$$  
\dot Q = 
\dot m_w c_{p,w}  
\left(  
T_{w,in}-T_{w,out}  
\right)  
$$

Con:

$$  
c_{p,w}  
\approx  
4{,}18\ \frac{kJ}{kgK}  
$$

### Balance con el aire

$$  
\dot Q = 
\dot m_a  
\left(  
h_{a,out}-h_{a,in}  
\right)  
$$

La diferencia de entalpía del aire incluye calor sensible y el efecto de la humedad.

### Relación de caudales

Dato habitual del problema:

$$  
\frac{\dot m_w}{\dot m_{aire}} = 
dato  
$$

### Punto de salida del aire

A partir del balance de energía:

$$  
h_{a,out} = 
h_{a,in}  
+  
\frac{  
\dot m_w c_{p,w}  
\left(  
T_{w,in}-T_{w,out}  
\right)  
}{  
\dot m_a  
}  
$$

### Diagrama psicrométrico

Se conoce:

$$  
T_{bs}  
$$

$$  
T_{bh}  
$$

Se lee en el diagrama psicrométrico:

$$  
h_{a,in}  
$$

$$  
\omega_{in}  
$$

$$  
v_{a,in}  
$$

Para la salida, se usa:

$$  
h_{a,out}  
$$

y se lee:

$$  
\omega_{out}  
$$

$$  
v_{a,out}  
$$

Caudal volumétrico de aire:

$$  
\dot V_a = 
\dot m_a v_a  
$$

Para dimensionar ventiladores suele usarse el volumen específico de salida:

$$  
\dot V_{a,out} = 
\dot m_a v_{a,out}  
$$

### Rendimiento del ventilador

$$  
\eta_{vent} = 
\frac{  
\Delta p\dot V_a  
}{  
\dot W_{vent}  
}  
$$

Despejando:

$$  
\dot W_{vent} = 
\frac{  
\Delta p\dot V_a  
}{  
\eta_{vent}  
}  
$$

### Número de concentraciones

$$  
N=  
\frac{C_p}{C_0}  
$$

donde:

$$  
C_p  
$$

es la concentración en la purga.

$$  
C_0  
$$

es la concentración en el agua de aporte.

### Caudal de purga

$$  
\dot m_p = 
\frac{  
\dot m_{ev}  
}{  
N-1  
}  
$$

### Caudal de reposición

La reposición compensa evaporación y purga:

$$  
\dot m_{rep} = 
\dot m_{ev}  
+  
\dot m_p  
$$

Sustituyendo el caudal de purga:

$$  
\dot m_{rep} = 
\dot m_{ev}  
+  
\frac{\dot m_{ev}}{N-1}  
$$

$$  
\dot m_{rep} = 
\dot m_{ev}  
\frac{N}{N-1}  
$$

### Caudal evaporado

A partir de la humedad específica del aire:

$$  
\dot m_{ev} = 
\dot m_a  
\left(  
\omega_{out}-\omega_{in}  
\right)  
$$

### Potencia de bomba

Caudal volumétrico de agua:

$$  
\dot V_w = 
\frac{\dot m_w}{\rho_w}  
$$

Potencia de bombeo:

$$  
\dot W_B = 
\frac{  
\Delta p\dot V_w  
}{  
\eta_B  
}  
$$

### Resolución

1. Calcular la temperatura de salida del agua con la eficiencia:

$$  
T_{w,out}  
$$

2. Calcular el caudal de agua:

$$  
\dot m_w  
$$

a partir del dato de calor o de condensación del problema.

3. Obtener el caudal de aire usando la relación agua-aire:

$$  
\frac{\dot m_w}{\dot m_a}  
$$

4. Usar el diagrama psicrométrico:
    - leer la entalpía de entrada del aire,
    - calcular la entalpía de salida,
    - leer humedad específica y volumen específico.
5. Calcular el caudal volumétrico de aire:

$$  
\dot V_a  
$$

6. Calcular la potencia de ventilador:

$$  
\dot W_{vent}  
$$

7. Calcular la potencia de bomba:

$$  
\dot W_B  
$$

### Recuerdo

Usar:

$$  
T_{bh}  
$$

No usar:

$$  
T_{bs}  
$$

Conversión anotada:

$$  
Pa=  
\frac{N}{m^2} = 
\frac{J}{m^3}  
$$


## Página 5: compresión mecánica

### Diagrama p-h

El esquema muestra un ciclo frigorífico simple sobre un diagrama presión-entalpía.

Elementos del diagrama:

- Eje vertical: presión.
- Eje horizontal: entalpía.
- Campana de saturación.
- Zona de líquido a la izquierda.
- Zona de vapor a la derecha.
- Condensación a presión alta.
- Evaporación a presión baja.
- Compresión desde el punto 1 hasta el punto 2.
- Expansión desde el punto 3 hasta el punto 4.

Puntos del ciclo:

1. Salida del evaporador y entrada del compresor.
2. Salida del compresor y entrada del condensador.
3. Salida del condensador y entrada de la válvula.
4. Salida de la válvula y entrada del evaporador.

Efecto frigorífico:

$$  
\Delta h_E=h_1-h_4  
$$

Trabajo específico de compresión:

$$  
\Delta h_W=h_2-h_1  
$$

Calor específico cedido en el condensador:

$$  
\Delta h_C=h_2-h_3  
$$

Balance energético corregido del ciclo:

$$  
\dot W = 
\dot Q_C-\dot Q_E  
$$

Con caudal másico de refrigerante:

$$  
\dot W = 
\dot m\left(h_2-h_1\right)  
$$

$$  
\dot Q_E = 
\dot m\left(h_1-h_4\right)  
$$

$$  
\dot Q_C = 
\dot m\left(h_2-h_3\right)  
$$

Por tanto:

$$  
\dot m\left(h_2-h_1\right) = 
\dot m\left(h_2-h_3\right) - 
\dot m\left(h_1-h_4\right)  
$$

### Gráfico de temperatura

En la parte superior derecha aparece un esquema temperatura-calor con:

- Zona de cambio de fase casi horizontal.
- Zona de desrecalentamiento.
- Zona de subenfriamiento.
- Curva con incremento de temperatura al final.

### Notas conceptuales

Bomba de calor: aumenta la temperatura del foco caliente condensando el refrigerante.

Máquina de refrigeración: disminuye la temperatura del foco frío evaporando el refrigerante.

### Rendimiento de máquina frigorífica

EER nominal:

$$  
EER_n=  
\frac{\dot Q_E}{\dot W}  
$$

SEER estacional:

$$  
SEER=  
\frac{  
\sum_j h_j\dot Q_{E,j}  
}{  
\sum_j h_j\dot W_j  
}  
$$

Como:

$$  
\dot W_j=  
\frac{\dot Q_{E,j}}{EER_j}  
$$

entonces:

$$  
SEER=  
\frac{  
\sum_j h_j\dot Q_{E,j}  
}{  
\sum_j h_j  
\frac{\dot Q_{E,j}}{EER_j}  
}  
$$

Anotación:

$$  
h_j=horas  
$$

### Rendimiento de bomba de calor

COP:

$$  
COP=  
\frac{\dot Q_C}{\dot W}  
$$

Si hay varios compresores:

$$  
COP=  
\frac{\dot Q_C}{\sum \dot W_{comp}}  
$$

SCOP estacional:

$$  
SCOP=  
\frac{  
\sum_j h_j\dot Q_{C,j}  
}{  
\sum_j h_j\dot W_j  
}  
$$

Como:

$$  
\dot W_j=  
\frac{\dot Q_{C,j}}{COP_j}  
$$

entonces:

$$  
SCOP=  
\frac{  
\sum_j h_j\dot Q_{C,j}  
}{  
\sum_j h_j  
\frac{\dot Q_{C,j}}{COP_j}  
}  
$$

Aparece una anotación final relacionada con factores de ponderación o corrección:

$$  
SCOP = COP \cdot FP \cdot FC  
$$

La lectura exacta de esos factores es dudosa.

### Ciclo en cascada

En el intercambiador intermedio se cumple:

$$  
\dot Q_{C,baja} = 
\dot Q_{E,alta}  
$$

En términos de entalpías:

$$  
\dot Q_{C,baja} = 
\dot m_1\Delta h_{C,1}  
$$

$$  
\dot Q_{E,alta} = 
\dot m_2\Delta h_{E,2}  
$$

Por tanto:

$$  
\dot m_1\Delta h_{C,1} = 
\dot m_2\Delta h_{E,2}  
$$

EER del ciclo en cascada:

$$  
EER=  
\frac{\dot Q_E}{\dot W_1+\dot W_2}  
$$

COP del ciclo en cascada:

$$  
COP=  
\frac{\dot Q_C}{\dot W_1+\dot W_2}  
$$

Compresor no ideal:

$$  
\eta_s = 
\frac{h_{2s}-h_1}{h_2-h_1}  
$$

Despejando:

$$  
h_2 = 
h_1+  
\frac{h_{2s}-h_1}{\eta_s}  
$$

Conversión energética:

$$  
kWh=kW\cdot h  
$$

Anotación:

$$  
1\ m^3\ de\ gas  
\approx  
10\ kWh  
$$

### Esquema del ciclo

El esquema inferior representa un ciclo de compresión mecánica:

- Condensador en la parte superior.
- Evaporador en la parte inferior.
- Válvula de expansión en el lateral izquierdo.
- Compresor en el lateral derecho.
- Puntos numerados:
    - 1: salida del evaporador y entrada del compresor.
    - 2: salida del compresor y entrada del condensador.
    - 3: salida del condensador y entrada de la válvula.
    - 4: salida de la válvula y entrada del evaporador.

---
