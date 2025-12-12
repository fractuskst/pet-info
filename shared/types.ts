export interface IPet {
  id: number;
  name: string;
  type: string;
  mainPhoto?: string;
  birthDate?: number;
  age?: string;
  breed?: string;
  favToys?: string;
  description?: string;
}

export interface IPetPhoto {
  id: number;
  petId: number;
  url: string;
}
