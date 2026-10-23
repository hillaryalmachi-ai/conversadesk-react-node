const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

export const seedConversations = [
  {
    id: 'c-101', name: 'Camila Torres', company: 'Casa Botánica', initials: 'CT',
    channel: 'WhatsApp', topic: 'Disponibilidad de producto', priority: 'high', status: 'open',
    messages: [
      { id: 'm-1', direction: 'inbound', text: '¡Hola! ¿Tienen disponible el kit de plantas para interior?', at: minutesAgo(44) },
      { id: 'm-2', direction: 'outbound', text: '¡Hola, Camila! Sí, tenemos disponibilidad. ¿Te gustaría conocer las opciones?', at: minutesAgo(38) },
      { id: 'm-3', direction: 'inbound', text: 'Sí, por favor. ¿Incluye macetas?', at: minutesAgo(8) }
    ]
  },
  {
    id: 'c-102', name: 'Andrés Vega', company: 'Nube Estudio', initials: 'AV',
    channel: 'Instagram', topic: 'Información de envío', priority: 'normal', status: 'pending',
    messages: [
      { id: 'm-4', direction: 'inbound', text: 'Buenas, quisiera saber si realizan envíos fuera de la ciudad.', at: minutesAgo(85) },
      { id: 'm-5', direction: 'outbound', text: '¡Hola! Revisaremos las opciones de entrega y te confirmaremos.', at: minutesAgo(62) }
    ]
  },
  {
    id: 'c-103', name: 'Valentina Ruiz', company: 'Luna Café', initials: 'VR',
    channel: 'WhatsApp', topic: 'Seguimiento de pedido', priority: 'normal', status: 'open',
    messages: [
      { id: 'm-6', direction: 'inbound', text: '¿Podrían ayudarme con el estado de mi pedido?', at: minutesAgo(56) },
      { id: 'm-7', direction: 'outbound', text: '¡Por supuesto! Indícanos el número de pedido, por favor.', at: minutesAgo(41) },
      { id: 'm-8', direction: 'inbound', text: 'Es el pedido 2048. ¡Gracias!', at: minutesAgo(19) }
    ]
  },
  {
    id: 'c-104', name: 'Mateo Salazar', company: 'Forma Market', initials: 'MS',
    channel: 'Webchat', topic: 'Consulta comercial', priority: 'low', status: 'resolved',
    messages: [
      { id: 'm-9', direction: 'inbound', text: '¿Dónde puedo ver su catálogo?', at: minutesAgo(185) },
      { id: 'm-10', direction: 'outbound', text: 'Puedes consultar todos nuestros productos en la sección Tienda. ¡Gracias!', at: minutesAgo(173) }
    ]
  },
  {
    id: 'c-105', name: 'Sofía López', company: 'Taller Norte', initials: 'SL',
    channel: 'Instagram', topic: 'Precios de servicio', priority: 'high', status: 'open',
    messages: [
      { id: 'm-11', direction: 'inbound', text: 'Hola, ¿podrían compartir sus planes y precios?', at: minutesAgo(27) }
    ]
  }
];
