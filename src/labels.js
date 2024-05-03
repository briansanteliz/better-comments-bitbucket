import * as icons from './icons.js'

export const semanticLabels = {
  praise: {
    text: 'praise',
    description:
      'Los praise resaltan algo positivo',
    icon: icons.trophyIcon,
    hasBlockingOption: false,
    defaultValue: true,
  },
  nitpick: {
    text: 'nitpick',
    description:
      'Los nitpicks son solicitudes triviales basadas en preferencias. Estas deben ser no bloqueantes por naturaleza.',
    icon: icons.searchIcon,
    hasBlockingOption: false,
    defaultValue: true,
  },
  suggestion: {
    text: 'suggestion',
    description:
      'Las suggestion proponen mejoras al tema actual. Es importante ser explícito y claro sobre qué se está sugiriendo y por qué es una mejora. Considera usar las decoraciones de blocking o no-bloking para comunicar aún más tu intención.',
    icon: icons.exclamationIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  issue: {
    text: 'issue',
    description:
      'Los issues resaltan problemas específicos con el tema en revisión. Estos problemas pueden ser visibles para el usuario o estar detrás de escena. Se recomienda encarecidamente combinar este comentario con una sugerencia. Si no estás seguro de si existe un problema o no, considera dejar una pregunta.',
    icon: icons.bugIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  todo: {
    text: 'todo',
    description:
      'Los "todos" son cambios pequeños, triviales pero necesarios. Distinguir comentarios de "todos" de issues: o sugerencias: ayuda a dirigir la atención del lector a comentarios que requieren más participación.',
    icon: icons.todoIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  question: {
    text: 'question',
    description:
      'Las question son apropiadas si tienes una preocupación potencial pero no estás seguro de si es relevante o no. Pedir al autor aclaraciones o investigaciones puede llevar a una resolución rápida.',
    icon: icons.questionIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  thought: {
    text: 'thought',
    description:
      'Los thoughts representan una idea que surgió al revisar. Estos comentarios son no bloqueantes por naturaleza, pero son extremadamente valiosos y pueden llevar a iniciativas más enfocadas y oportunidades de mentoría.',
    icon: icons.commentIcon,
    hasBlockingOption: false,
    defaultValue: true,
  },
  chore: {
    text: 'chore',
    description:
      'Los chores son tareas simples que deben hacerse antes de que el tema pueda ser "oficialmente" aceptado. Por lo general, estos comentarios hacen referencia a algún proceso común. Intenta dejar un enlace a la descripción del proceso para que el autor sepa cómo resolver la tarea.',
    icon: icons.homeIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  note: {
    text: 'note',
    description:
      'Las notes son siempre no bloqueantes y simplemente resaltan algo que el autor debe tener en cuenta.',
    icon: icons.noteIcon,
    hasBlockingOption: false,
    defaultValue: true,
  },
  typo: {
    text: 'typo',
    description: 'Los typos son errores tipográficos que deben ser corregidos.',
    icon: icons.typoIcon,
    hasBlockingOption: false,
    defaultValue: false,
  },
  polish: {
    text: 'polish',
    description:
      'Los polishes son como sugerencias, donde no hay nada necesariamente malo con el contenido relevante, simplemente hay algunas formas de mejorar inmediatamente la calidad.',
    icon: icons.polishIcon,
    hasBlockingOption: true,
    defaultValue: false,
  },
  quibble: {
    text: 'quibble',
    description:
      'Los quibbles son muy parecidos a los nitpicks:, excepto que no son necesariamente triviales.',
    icon: icons.quibbleIcon,
    hasBlockingOption: false,
    defaultValue: false,
  },
}
