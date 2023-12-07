export class FileValidatorService {
  static validateSize(file: File): boolean {
    const maxSize = 80000;

    if (file.size > maxSize) {
      throw new FileValidatorError('Max file size can be 80kb');
    }

    return true;
  }

  static validateImgType(file: File): boolean {
    if (file.type.match(new RegExp('.*(jpeg | jpg | png)$'))) {
      throw new FileValidatorError('File type can be png, jpeg, jpg');
    }

    return true;
  }
}

export class FileValidatorError extends Error {
  constructor(message: string) {
    super(message);
  }
}
