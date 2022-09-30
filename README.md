# Pomodoro Bot
Pomodoro es un sencillo Bot que te acompañará en tus sesiones de estudio y sacará de ti el máximo rendimiento.

## Empecemos

Para añadir este Bot a tu servidor, [haz click aquí](https://discord.com/oauth2/authorize?client_id=1000722373336637570&permissions=8&scope=bot).

## Comandos

### Comenzar sesión de estudio

Para comenzar una sesión de estudio basta con usar el comando ```start``` en el canal de texto ```pomodoro-bot```

```!start <study> <rest>```  

#### Ejemplo

```!start 25 5```

Con este comando, comenzará una sesión de 25 minutos de estudio seguida de un descanso de 5.

Si no indicas ningún argumento después del comando start, por defecto se iniciarán sesiones de 50 minutos de estudio y 10 de descanso.

### Terminar sesión de estudio

Si quieres terminar tu sesión de estudio, desconecta a Pomodoro Bot de tu sala con el comando ```end```

```!end```  

### Programar sesión de estudio

Si no quieres comenzar en este momento la sesión, y quieres dejarla programada, puedes usar el comando ```program``` en el canal de texto ```pomodoro-bot```

```!program <date> <study> <rest>```  

#### Ejemplo

```!start 16:00 25 5```

Con este comando, a las 16:00 comenzará una sesión de 25 minutos de estudio seguida de un descanso de 5.

Si no indicas los dos últimos argumentos, por defecto se iniciarán sesiones de 50 minutos de estudio y 10 de descanso.

Recuerda que a la hora que hayas programado la sesión deberás encontrarte en una sala de voz, para que el Bot sepa a qué canal unirse.

### Ayuda

Si necesitas ayuda, tienes disponible el comando ```!help``` que te ayudará a recordar la sintaxis de los comandos
