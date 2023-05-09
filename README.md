Fecha: 23-04-22

Antes de iniciar el servidor sigue los siguentes pasos:

1 - Asegurate que la base de datos ya exista, en caso contrario corre el script que esta ubicado en:
    conection_store > database.sql.

2 - Configurar el archivo "config.js"
    *Por defecto el backend correra en el puerto 3002.
    *El puerto del frontend lo conigure para que corriera en el puerto 3000 (defualt de react).
    *Por defecto el host de mysql el "localhost".
    *El nombre de la base de datos sera "proyecto_geriatra" (o si le pones otro nombre, cambiarlo por ese).
    
    *Pon tus credenciales (usuario y contraseña) para hacer la conexion a la base de datos.
        Nota: Asegurate que el "usuario" tenga todos los "privilegios" necesarios.

    En caso de que un dato este erróneo, cambialo para que la configuración sea la correcta.

3 - Instala los modulos (dependencias) necesarios, corre en tu terminal: npm i
        En caso de que no funcione instala manualmente las dependencias necesarias ubicadas en "package.json"

Ya con lo anterior realizado corre el servidor
    node index.js 
    (En caso de que tengas nodemon instalado: nodemon index.js )

    Nota: Asegurate que tu consola este en la ruta donde esta el index.js
