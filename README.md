# Pomodoro Flip Clock

Una aplicación web moderna de Pomodoro timer con estética visual de flip clock (reloj digital con fichas que voltean).

## Características

✨ **Interfaz tipo Flip Clock**: Displays digitales con efecto de volteo estilo reloj vintage
🍅 **Técnica Pomodoro**: Sesiones de 25 minutos de trabajo y 5 minutos de descanso
📊 **Contador de Sesiones**: Visualiza cuántas sesiones completaste
🎵 **Notificación de Audio**: Sonido cuando termina cada sesión
📱 **Responsive Design**: Funciona perfectamente en cualquier dispositivo
🎨 **Diseño Moderno**: Interfaz oscura con colores neón y efectos visuales

## Tecnologías

- **React 18**: Librería de UI
- **Vite**: Build tool rápido
- **CSS3**: Animaciones y estilos modernos
- **JavaScript Vanilla Audio API**: Para notificaciones de audio

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Build para Producción

```bash
npm run build
```

## Cómo usar

1. **Iniciar/Pausar**: Haz clic en el botón "INICIAR" para comenzar la sesión
2. **Reiniciar**: Vuelve a la sesión de trabajo completa
3. **Saltar**: Salta a la siguiente sesión (trabajo → descanso o viceversa)

## Estructura del Proyecto

```
src/
├── components/
│   ├── FlipClock.jsx        # Componente del reloj flip clock
│   ├── FlipClock.css        # Estilos del flip clock
│   ├── SessionController.jsx # Componentes de control (botones)
│   └── SessionController.css # Estilos de los botones
├── App.jsx                  # Componente principal
├── App.css                  # Estilos principales
├── index.css                # Estilos globales
└── main.jsx                 # Punto de entrada
```

## Duración de las Sesiones

- **Trabajo**: 25 minutos
- **Descanso**: 5 minutos

Puedes editar estos valores en `App.jsx` cambiando las variables `workDuration` y `breakDuration`.

---

Hecho con ❤️ para aumentar tu productividad
