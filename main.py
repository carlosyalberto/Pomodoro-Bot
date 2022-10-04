from types import NoneType
import discord
from discord.ui import Button, View
from discord.ext import commands
from discord.ext.commands import errors
import asyncio
from database import db_insert
import datetime
import pytz
from config import TOKEN


intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)
client = discord.Client(intents=intents)

# Comandos
@bot.command()
async def start(ctx, study_time=50, rest_time=10, microfone=1):
    if str(ctx.message.channel) == 'pomodoro-bot':
        try:
            channel = ctx.author.voice.channel
            # Voice Channel
            vc = await channel.connect()

            # Mientras estemos conectados al canal que se repita el bucle de estudio/descanso
            while len(channel.members) > 1 and bot.voice_clients != None: # el lio del problema que me dijo gg está en lo de bot.voice_clients pero no acabo de entenderlo
                countdown = study_time
                # Se reproduce el sonido de comienzo
                """ vc.play(discord.FFmpegOpusAudio(
                        source='/home/ubuntu/pomodoro/src/study.mp3')
                        ) """
                # Se mutea a los miembros
                if microfone == 1:
                    for i in channel.members:
                        if i == bot.user:
                            continue
                        await i.edit(mute = True)

                # Se envía el mensaje de comienzo
                embed = discord.Embed(title='Sesión de estudio de {} minutos'.format(
                    study_time), description='Quedan {} minutos'.format(countdown), color=0x2A033A)
                msg = await ctx.send(embed=embed)

                # Se espera el timpo de estudio
                i = 0
                j = 0
                while i < int(study_time)*60:
                    # print(i)
                    await asyncio.sleep(1)
                    i = i + 1
                    j = j + 1
                    if j == 60:
                        countdown = countdown - 1
                        j = 0
                        await msg.edit(
                            embed=discord.Embed(
                                title='Sesión de estudio de {} minutos'.format(
                                    study_time),
                                description='Quedan {} minutos'.format(
                                    countdown),
                                color=0x2A033A)
                        )

                    # print(countdown)

                    if len(channel.members) == 1 or bot.voice_clients == None:
                        break

                if len(channel.members) == 1 or bot.voice_clients == None:
                    break

                # Se desmutea a los miembros
                if microfone == 1:
                    for i in channel.members:
                        if i == bot.user:
                            continue
                        await i.edit(mute=False)

                # Mensaje de botones de descanso
                button1 = Button(style=discord.ButtonStyle.grey,
                                 emoji="🥵", custom_id='1')
                button2 = Button(style=discord.ButtonStyle.grey,
                                 emoji="😰", custom_id='2')
                button3 = Button(style=discord.ButtonStyle.grey,
                                 emoji="😐", custom_id='3')
                button4 = Button(style=discord.ButtonStyle.grey,
                                 emoji="🙂", custom_id='4')
                button5 = Button(style=discord.ButtonStyle.grey,
                                 emoji="😀", custom_id='5')

                # Interacciones con el mensaje
                async def button_callback(interaction):
                    db_insert(datetime.datetime.now(pytz.timezone('Europe/Madrid')),
                              interaction.user,
                              interaction.data['custom_id'])
                    try:
                        await interaction.response.send_message("Recibido, {}!".format(interaction.user))
                    except:
                        await ctx.send("Oops! Algo no fue bien, pulsa de nuevo")

                button1.callback = button_callback
                button2.callback = button_callback
                button3.callback = button_callback
                button4.callback = button_callback
                button5.callback = button_callback

                view = View()
                view.add_item(button1)
                view.add_item(button2)
                view.add_item(button3)
                view.add_item(button4)
                view.add_item(button5)

                # Se envía el mensaje de descanso
                countdown = rest_time
                embed = discord.Embed(title='Descanso de {} minutos'.format(rest_time),
                                      description='Quedan {} minutos \n\n ¿Qué tal fue la sesión de estudio? Puedes indicar aquí tu nivel de cansancio a través de los emojis.'.format(
                                          countdown),
                                      color=0x6D3588)
                embed.add_field(name='Para consultar tus estadísticas,',
                                value='[haz click aquí](https://pomodorobot.infinityfreeapp.com/)',
                                inline=True)

                msg = await ctx.send(embed=embed, view=view)
                # Se reproduce el sonido de descanso
                """ vc.play(discord.FFmpegOpusAudio(
                        source='/home/ubuntu/pomodoro/src/rest.mp3')
                        ) """
                # Se espera el timpo de descanso

                i = 0
                j = 0
                while i < int(rest_time)*60:
                    await asyncio.sleep(1)
                    i = i + 1
                    j = j + 1
                    quinceleft = int(rest_time)*60 - 15
                    if i == quinceleft:
                        """ vc.play(discord.FFmpegOpusAudio(
                        source='/home/ubuntu/pomodoro/src/quinceleft.mp3')
                        ) """
                    if j == 60:
                        countdown = countdown - 1
                        j = 0
                        await msg.edit(embed=discord.Embed(title='Descanso de {} minutos'.format(rest_time),
                                                           description='Quedan {} minutos \n\n ¿Qué tal fue la sesión de estudio? Puedes indicar aquí tu nivel de cansancio a través de los emojis.'.format(
                                                           countdown),
                                                           color=0x6D3588).add_field(name='Para consultar tus estadísticas,', value='[haz click aquí](https://pomodorobot.infinityfreeapp.com/)',inline=True))
                    if len(channel.members) == 1 or bot.voice_clients == None:
                        break

            # Cuando se vaya todo el mundo del canal, el Bot se desconecta
            await ctx.voice_client.disconnect()

        # Captura de excepciones
        except AttributeError as e:
            if str(e) == '\'NoneType\' object has no attribute \'disconnect\'':
                pass
            else:
                await ctx.message.channel.send("Ha ocurrido un error ({}). Asegurate de estar conectado a un canal de voz".format(str(e)))

        except errors.MissingRequiredArgument:
            print("Faltan atributos")
    else:
        await ctx.message.channel.send('Los comandos se escriben en el canal de texto "pomodoro-bot"')


@bot.command()
async def end(ctx):
    if str(ctx.message.channel) == 'pomodoro-bot':
        if ctx.voice_client != None:
            # desmutea antes de salirse
            channel = ctx.author.voice.channel
            for i in channel.members:
                if i == bot.user:
                    continue
                await i.edit(mute=False)
            await ctx.voice_client.disconnect()
        else:
            await ctx.message.channel.send(
                'No estás conectado a ningun canal de voz!!')
    else:
        await ctx.message.channel.send(
            'Los comandos se escriben en el canal de texto "pomodoro-bot"')


@bot.command()
async def program(ctx, start_time, study_time=50, rest_time=10):
    if str(ctx.message.channel) == 'pomodoro-bot':
        st = start_time.split(':')
        # await ctx.send('Su pomodoro empezará a las {}'.format(start_time)) # aqui va el embed
        hour = datetime.datetime.now(pytz.timezone('Europe/Madrid')).hour
        minute = datetime.datetime.now(
                pytz.timezone('Europe/Madrid')).minute
        h1 = datetime.timedelta(hours = int(st[0]), minutes = int(st[1]))
        h2 = datetime.timedelta(hours = hour, minutes = minute)
        time_left = h1 - h2
        time_left = str(time_left)[:4]
        embed = discord.Embed(title=' Su sesión de estudio empezará a las {}'.format(
                    start_time), description='Quedan {} para que empiece su sesión de estudio'.format(time_left), color=0xBEADB8)
        msg = await ctx.send(embed=embed)
        while True:  # bucle que compruebe el tiempo cada segundo
            
            await asyncio.sleep(1)
            hour = datetime.datetime.now(pytz.timezone('Europe/Madrid')).hour
            minute = datetime.datetime.now(
                pytz.timezone('Europe/Madrid')).minute
            int(st[0])
            h2 = datetime.timedelta(hours = hour, minutes = minute)
            time_left = h1 - h2
            time_left = str(time_left)[:4]
            await msg.edit(
                            embed=discord.Embed(
                                title=' Su sesión de estudio empezará a las {}'.format(
                    start_time),
                                description='Queda {} para que empiece su sesión de estudio'.format(time_left),
                                color=0xBEADB8))
            
            if int(st[0]) == int(hour) and int(st[1]) == int(minute):
                await ctx.invoke(bot.get_command('start'), int(study_time), int(rest_time))
                break
    else:
        await ctx.message.channel.send(
            'Los comandos se escriben en el canal de texto "pomodoro-bot"')


bot.remove_command('help')
@bot.command()
async def help(ctx):
    embed = discord.Embed(title='Ayuda',
                          description='Si necesitas ayuda, aquí va una lista con los comandos disponibles, que tendrás que escribir en el canal pomodoro-bot.',
                          color=0x6D3588)
    embed.add_field(name="Iniciar sesión", value="```!start <study_time> <rest_time>``` \n ***Ejemplo*** ```!start 25 5```  Se iniciará una sesión de 25 minutos de estudio y 5 de descanso. \nPor defecto, el uso del comando !start sin argumentos iniciará una sesión de 50 minutos de estudio y 10 de descanso)", inline=False)
    embed.add_field(name="Finalizar sesión",
                    value="```!end``` Al escribir este comando, el bot abandona la sala y termina la sesión", inline=False)
    embed.add_field(name="Programar una sesión", value="```!program <date> <study_time> <rest_time>``` \n ***Ejemplo*** ```!program 16:00 25 5``` Se iniciará una sesión de pomodoros de 25 minutos de estudio y 5 de descanso a las 16:00. \nRecuerda que a la hora que comience la sesión, debes estar en un canal de voz.", inline=False)
    embed.add_field(name="Desmutear", value="```!unmute``` \n Se desactiva la opción \"Silenciar en servidor\".", inline=False)

    msg = await ctx.send(embed=embed)

@bot.command()
async def unmute(ctx):
    await ctx.author.edit(mute=False)

# ------------------- #
#       Eventos       #
# ------------------- #

@bot.event
async def on_ready():
    print(
        'We have logged in as {0.user}'.format(bot)
    )  # creación de un canal para comandos la primera vez que se inicia el bot en un canal

    guild_name = bot.guilds[0]
    text_channel = guild_name.text_channels

    for i in range(0, len(text_channel)):
        var = 0

        if 'pomodoro-bot' == str(text_channel[i]):
            var = var + 1
            break

    if var == 0:
        await guild_name.create_text_channel('pomodoro-bot')


@bot.event
async def on_guild_join(guild):

    text_channel = guild.text_channels

    for i in range(0, len(text_channel)):
        var = 0

        if 'pomodoro-bot' == str(text_channel[i]):
            var = var + 1
            break

    if var == 0:
        pomodoro_channel = await guild.create_text_channel('pomodoro-bot')

        embed = discord.Embed(title='Hola 👋!',
                              description='Soy un sencillo Bot que te acompañará en tus sesiones de estudio y sacará de ti el máximo rendimiento.\n'
                              'Para aprender a usarme escribe en este mismo canal el comando: ```!help``` ',
                              color=0x6D3588)
        await pomodoro_channel.send(embed=embed)

# Ejecución
bot.run(TOKEN)
