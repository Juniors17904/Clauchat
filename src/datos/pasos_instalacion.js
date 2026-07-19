import { PasoInstalacion } from '../modelos/paso_instalacion.js';

export const PASOS_INSTALACION = [
  // ===== FASE 1: RESPALDO =====
  new PasoInstalacion({
    numero: 1,
    titulo: 'Datos del equipo',
    detalle: 'Anotar los datos de identidad del equipo antes de instalar la imagen nueva. Podés subir una foto de la pantalla por cada campo y la app intentará reconocer el dato — igual revisá y corregí.\n\nComandos útiles (cmd): hostname → nombre del equipo · whoami → usuario con dominio.',
    faseId: 'respaldo',
    campos: ['Username', 'Hostname', 'Nombre de tienda'],
  }),
  new PasoInstalacion({
    numero: 2,
    titulo: 'Obtener IP',
    detalle: 'Guardar la configuración de red actual del equipo (pantalla de Propiedades de TCP/IPv4). Se necesitará para restaurarla después de instalar la imagen.\n\nPara abrirla: Win + R → escribir ncpa.cpl → Enter → clic derecho en el adaptador → Propiedades → TCP/IPv4.\n\nCon una sola foto de esa pantalla la app puede reconocer varios campos a la vez.',
    faseId: 'respaldo',
    campos: ['Dirección IP', 'Máscara de subred', 'Puerta de enlace', 'DNS preferido', 'DNS alternativo'],
    fotoUnica: true,
  }),
  new PasoInstalacion({
    numero: 3,
    titulo: 'Copiar licencia (RMS Config)',
    detalle: 'Respaldar el archivo de licencia RMS Config del equipo en la carpeta de uso.',
    faseId: 'respaldo',
  }),
  new PasoInstalacion({
    numero: 4,
    titulo: 'Copia de seguridad (Backup BD)',
    detalle: 'Generar el respaldo de la base de datos del equipo y guardarlo en la carpeta de uso.',
    faseId: 'respaldo',
  }),

  // ===== FASE 2: CUENTA LOCAL LINDCORP =====
  new PasoInstalacion({
    numero: 5,
    titulo: 'Restaurar IP',
    detalle: 'Con la imagen nueva instalada, poner la IP de la tienda (si no se puede en tienda, realizarlo en el centro de capas), la máscara de red y el DNS del dominio de Lindcorp.\n\nAbrir con: Win + R → ncpa.cpl → clic derecho en el adaptador → Propiedades → TCP/IPv4.',
    faseId: 'cuenta-local',
    imagenes: ['/instalacion/p05-a.png'],
  }),
  new PasoInstalacion({
    numero: 6,
    titulo: 'Servicios Oracle',
    detalle: 'Revisar los servicios de Oracle del equipo antes de continuar con el cambio de nombre.\n\nAbrir con: Win + R → services.msc.',
    faseId: 'cuenta-local',
  }),
  new PasoInstalacion({
    numero: 7,
    titulo: 'Cambiar nombre y unir a dominio',
    detalle: 'Colocar el hostname de la tienda según el formato:\nTL = Tambo Lima · TP = Tambo Provincia · AL = Aruma Lima · AP = Aruma Provincia\n\nFormato: [[XX-NNNN-C]]\n· [[NNNN = número de tienda de 4 dígitos]]\n· [[C = caja (1 o 2)]]\n\nEjemplo: [[TL-1046-1]]\nDominio: LindcorpTiendas.net\n\nAbrir con: Win + R → sysdm.cpl → botón Cambiar.\n\nDespués del cambio, reiniciar el equipo.',
    faseId: 'cuenta-local',
    imagenes: ['/instalacion/p07-a.png', '/instalacion/p07-b.png'],
  }),
  new PasoInstalacion({
    numero: 8,
    titulo: 'Desactivar Firewall',
    detalle: 'Desactivar el firewall de Windows para permitir la comunicación de los servicios de Xstore.\n\nAbrir con: Win + R → firewall.cpl → Activar o desactivar Firewall de Windows Defender.',
    faseId: 'cuenta-local',
  }),
  new PasoInstalacion({
    numero: 9,
    titulo: 'Ver datos [INICIAR SESIÓN]',
    detalle: 'Verificar los datos configurados y cerrar sesión. A partir del siguiente paso se trabaja con el usuario de tienda (cuenta de dominio Tambo o Aruma).',
    faseId: 'cuenta-local',
  }),

  // ===== FASE 3: CUENTA DOMINIO — CONFIGURACIÓN =====
  new PasoInstalacion({
    numero: 10,
    titulo: 'Permisos de las 3 carpetas',
    detalle: 'Compartir 3 carpetas con la entidad "Authentic User": [[Oracle]], [[Staging]] y [[19c]] (esta última dentro de Oracle → [[C:\\Oracle\\19c]]).\n\nSiempre marcar "Reemplazar todas las entradas de permisos de objetos secundarios", aplicar, aceptar, y al final quitar el check de "Solo lectura" y aplicar.',
    faseId: 'cuenta-dominio-config',
    imagenes: ['/instalacion/p10-a.png', '/instalacion/p10-b.png', '/instalacion/p10-c.png', '/instalacion/p10-d.png', '/instalacion/p10-e.png', '/instalacion/p10-f.png'],
  }),
  new PasoInstalacion({
    numero: 11,
    titulo: 'Configurar listener.ora y tnsnames.ora',
    detalle: 'Editar los archivos [[listener.ora]] y [[tnsnames.ora]] con el usuario de tienda.\n\nRuta: [[C:\\Oracle\\19c\\db_home\\network\\admin]]\n\nEn ambos archivos, el HOST debe ser el hostname completo de la caja (ejemplo: TL-1014-1.LindcorpTiendas.net).',
    faseId: 'cuenta-dominio-config',
    imagenes: ['/instalacion/p11-a.png', '/instalacion/p11-b.png', '/instalacion/p11-c.png'],
  }),
  new PasoInstalacion({
    numero: 12,
    titulo: 'Configurar to_be_replaced.properties',
    detalle: 'Este es el archivo [[to_be_replaced.properties]] que se EDITA. Está en [[C:\\staging\\environment-files\\PROD]].\n\nCambiar los datos según la tienda:\n· orgId = 1\n· rtlLocId = número de tienda (ej. 1014)\n· terminalId = 1 o 2 según la caja\n· storeprimary.host = hostname de la CAJA 1\n· storeName = nombre de la tienda\n· locate.XstoreSystemCode = 1 (Tambo) o 2 (Aruma)',
    faseId: 'cuenta-dominio-config',
    imagenes: ['/instalacion/p12-a.png'],
  }),

  // ===== FASE 4: CUENTA DOMINIO — INSTALACIÓN =====
  new PasoInstalacion({
    numero: 13,
    titulo: 'Agregar usuario a ORA_DBA',
    detalle: 'En Grupos → [[ORA_DBA]], agregar el usuario de tienda correspondiente.\n\nAbrir con: Win + R → lusrmgr.msc → Grupos.',
    faseId: 'cuenta-dominio-instalacion',
    imagenes: ['/instalacion/p13-a.png'],
  }),
  new PasoInstalacion({
    numero: 14,
    titulo: 'Validar servicios Oracle',
    detalle: 'Todos los servicios Oracle deben estar en "Automático" (NO "Automático - inicio retrasado") y con estado "Iniciado".\n\nAbrir con: Win + R → services.msc.',
    faseId: 'cuenta-dominio-instalacion',
    imagenes: ['/instalacion/p14-a.png'],
  }),
  new PasoInstalacion({
    numero: 15,
    titulo: 'Validar Firewall',
    detalle: 'Confirmar que el firewall sigue desactivado antes de ejecutar los instaladores.\n\nAbrir con: Win + R → firewall.cpl.',
    faseId: 'cuenta-dominio-instalacion',
  }),
  new PasoInstalacion({
    numero: 16,
    titulo: 'Ejecutar 00.LDC-PROD',
    detalle: 'Ejecutar [[00.LDC-PROD]], ubicado en [[C:\\staging]]. NO realizarlo como administrador.\n\nSale una pantalla negra y, al terminar, se genera automáticamente un SEGUNDO archivo to_be_replaced.properties en [[C:\\staging]] (este es solo para validar en el paso siguiente, NO se edita).',
    faseId: 'cuenta-dominio-instalacion',
    imagenes: ['/instalacion/p16-a.png', '/instalacion/p16-b.png'],
    advertencia: 'No ejecutar como administrador',
  }),
  new PasoInstalacion({
    numero: 17,
    titulo: 'Validar to_be_replaced.properties (staging)',
    detalle: 'Este es el archivo que solo se VALIDA (no se edita). Es el que generó el LDC-PROD en [[C:\\staging]].\n\nConfirmar que todos los valores del paso 12 quedaron correctos (orgId, rtlLocId, terminalId, storeprimary.host, storeName, locate.XstoreSystemCode).',
    faseId: 'cuenta-dominio-instalacion',
    imagenes: ['/instalacion/p16-b.png'],
  }),
  new PasoInstalacion({
    numero: 18,
    titulo: 'Ejecutar 02.installXstore',
    detalle: 'Ejecutar [[02.installXstore]], ubicado en [[C:\\staging]], y confirmar cada dato con Y (sí) o N (no).\n\nDurante la instalación saldrán 2 solicitudes de credenciales: confirmarlas con el usuario administrator y la contraseña indicada por soporte.',
    faseId: 'cuenta-dominio-instalacion',
    imagenes: ['/instalacion/p18-a.png', '/instalacion/p18-b.png', '/instalacion/p18-c.png'],
  }),
  new PasoInstalacion({
    numero: 19,
    titulo: 'Ejecutar KillXStore',
    detalle: 'Ejecutar [[KillXStore]], ubicado en el [[Escritorio]], para detener los procesos de Xstore antes de configurar los permisos de las carpetas nuevas.',
    faseId: 'cuenta-dominio-instalacion',
  }),
  new PasoInstalacion({
    numero: 20,
    titulo: 'Permisos de las 6 carpetas Xstore',
    detalle: 'Compartir las 6 carpetas nuevas que se crearon en [[C:\\]] tras instalar Xstore, de la misma forma que las anteriores (entidad "Authentic User" y desmarcar siempre "Solo lectura"):\n\n· [[eftlink]]\n· [[environment]]\n· [[jre]]\n· [[xstore]]\n· [[xstoredata]]\n· [[xstore-mobile]]',
    faseId: 'cuenta-dominio-instalacion',
    imagenes: ['/instalacion/p20-a.png', '/instalacion/p20-b.png', '/instalacion/p20-c.png', '/instalacion/p20-d.png'],
  }),
  new PasoInstalacion({
    numero: 21,
    titulo: 'Copiar archivos TOTP Authentication',
    detalle: 'Solo en la caja 1 (en caja 2 omitir este paso).\n\nCopiar todo el contenido de:\n[[C:\\staging\\environment-files\\PROD\\security\\Xenvironment TOTP Authentication]]\n\nY pegarlo en:\n[[C:\\xstoredata\\xstore\\download]]',
    faseId: 'cuenta-dominio-instalacion',
    imagenes: ['/instalacion/p21-a.png', '/instalacion/p21-b.png'],
  }),
  new PasoInstalacion({
    numero: 22,
    titulo: 'Ejecutar dataloader2.bat',
    detalle: 'Solo en la caja 1 (en caja 2 omitir este paso).\n\nCuando den la CONFIRMACIÓN DEL DESPLIEGUE DEL XADMIN, ejecutar [[dataloader2.bat]].\n\nAl finalizar: abrir Xstore y dejar Google Chrome con la página de enroll:\n[[https://localhost:9096/cloudenroll]]',
    faseId: 'cuenta-dominio-instalacion',
    imagenes: ['/instalacion/p22-a.png', '/instalacion/p22-b.png'],
  }),
  new PasoInstalacion({
    numero: 23,
    titulo: 'Instalación de aplicaciones y software',
    detalle: 'Instalar el Axteroid luego de enrolar y aprovechar en instalar lo del checklist.\n\n(El detalle de este paso se completará con el manual de programas y software.)',
    faseId: 'cuenta-dominio-instalacion',
  }),
];
