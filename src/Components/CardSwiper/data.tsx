export interface DataType {
  cardId: number;
  name: string;
  image: string;
  distance: string;
}

const data: DataType[] = [
  {
    cardId: 1,
    name: "Jenny",
    distance: "6 km away",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fyc3xlbnwwfDF8MHx8fDA%3D",
  },
  {
    cardId: 2,
    name: "Rakha Wibowo",
    distance: "3 km away",
    image:
      "https://plus.unsplash.com/premium_photo-1677993185892-f7823f314c4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2Fyc3xlbnwwfDF8MHx8fDA%3D",
  },
  {
    cardId: 3,
    name: "Ferrari",
    distance: "2 km away",
    image:
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnN8ZW58MHwxfDB8fHww",
  },
  {
    cardId: 3,
    name: "Camero White",
    distance: "5 km away",
    image:
      "https://images.unsplash.com/photo-1555353540-64580b51c258?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2Fyc3xlbnwwfDF8MHx8fDA%3D",
  },
];

export { data };
