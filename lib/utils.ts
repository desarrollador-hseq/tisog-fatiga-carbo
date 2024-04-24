import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge"
import { db } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function capitalizeFirstLetter(string: string): string {
  const words = string.split(" ");

  const capitalize = words.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");

  return capitalize
}


export const formatDate = (date: Date): string => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
};

export const formatDateCert = (date: Date) => {
  let formattedDate = format(date, "'día' dd' de' MMMM 'de' yyyy", {
    locale: es,
  });

  if (date.getDate() === 1) {
    formattedDate = formattedDate.replace("días", "día");
  }
  return formattedDate;
};

export const normalizeString = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export const getArraySymptomsByIds = async (symptomsIds: string[]) => {
  try {
    // Buscar el parámetro "symptoms" en la base de datos
    const parameter = await db.parameter.findUnique({
      where: {
        name: "symptoms",
      },
      include: {
        defaultValues: true,
      },
    });

    if (!parameter || !parameter.defaultValues) {
      // Manejar el caso en el que no se encuentren los síntomas o los valores predeterminados
      throw new Error("No se encontraron síntomas o valores predeterminados.");
    }

    // Filtrar los síntomas correspondientes a los IDs proporcionados
    const selectedSymptoms = parameter.defaultValues.filter((symptom) =>
      symptomsIds.includes(symptom.id)
    );

    // Construir un array con los nombres de los síntomas seleccionados
    const symptomNames = selectedSymptoms.map((symptom) => symptom.name);

    return symptomNames;
  } catch (error) {
    console.error("Error al obtener los nombres de los síntomas:", error);
    throw new Error("Error al obtener los nombres de los síntomas.");
  }
};