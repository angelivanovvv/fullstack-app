export type ErrorGeneratorTypes = {
  field: string;
  message: string;
};

export const errorGenerator = (
  field: string,
  message: string
): ErrorGeneratorTypes => ({ field, message });
