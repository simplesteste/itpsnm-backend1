"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/factories/make-student-use-case.ts
var make_student_use_case_exports = {};
__export(make_student_use_case_exports, {
  makeStudentUseCase: () => makeStudentUseCase
});
module.exports = __toCommonJS(make_student_use_case_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: ["query", "info", "warn", "error"]
});

// src/repositories/prisma/prisma-student-repository.ts
var PrismaStudentsRepository = class {
  async findById(id) {
    let findStudent = await prisma.student.findUnique({
      where: {
        id
      }
    });
    return findStudent;
  }
  async findByIdentityCardNumber(identityCardNumber) {
    let findStudent = await prisma.student.findUnique({
      where: {
        identityCardNumber
      }
    });
    return findStudent;
  }
  async findByAlternativePhone(phone) {
    let findStudent = await prisma.student.findFirst({
      where: {
        alternativePhone: phone
      }
    });
    return findStudent;
  }
  async findByPhone(phone) {
    let findStudent = await prisma.student.findUnique({
      where: {
        phone
      }
    });
    return findStudent;
  }
  findByName(name) {
    throw new Error("Method not implemented.");
  }
  // async findByEmail(email: string): Promise<Student | null> {
  //   let findStudent = await prisma.student.findUnique({
  //     where: {
  //       email
  //     }
  //   })
  //   return findStudent
  // }
  async create(data) {
    let {
      id,
      countyId,
      dateOfBirth,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      maritalStatus,
      mother,
      phone,
      provinceId,
      residence,
      type,
      alternativePhone
    } = data;
    let student = await prisma.student.create({
      data: {
        id,
        countyId,
        dateOfBirth,
        emissionDate,
        expirationDate,
        father,
        fullName,
        gender,
        height,
        identityCardNumber,
        maritalStatus,
        mother,
        phone,
        provinceId,
        residence,
        type,
        alternativePhone
      }
    });
    return student;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    const totalItems = await prisma.student.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    let students = await prisma.student.findMany({
      where: {
        fullName: {
          contains: query,
          mode: "insensitive"
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: students
    };
  }
  async destroy(id) {
    let destroyStudent = await prisma.student.delete({
      where: {
        id
      }
    });
    return destroyStudent ? true : false;
  }
};

// src/use-cases/errors/phone-already-exists-error.ts
var PhoneAlreadyExistsError = class extends Error {
  constructor() {
    super("Phone already exists.");
  }
};

// src/use-cases/errors/id-card-already-exists-error.ts
var IdentityCardNumberAlreadyExistsError = class extends Error {
  constructor() {
    super("Identity card number already exists.");
  }
};

// src/use-cases/errors/province-not-found.ts
var ProvinceNotFoundError = class extends Error {
  constructor() {
    super("Province not found.");
  }
};

// src/use-cases/errors/county-not-found.ts
var CountyNotFoundError = class extends Error {
  constructor() {
    super("County not found.");
  }
};

// src/use-cases/student/create-student.ts
var CreateStudentUseCase = class {
  constructor(studentRepository, provinceRepository, countyRepository) {
    this.studentRepository = studentRepository;
    this.provinceRepository = provinceRepository;
    this.countyRepository = countyRepository;
  }
  async execute({
    id,
    countyId,
    dateOfBirth,
    emissionDate,
    expirationDate,
    father,
    fullName,
    gender,
    height,
    identityCardNumber,
    maritalStatus,
    mother,
    phone,
    provinceId,
    residence,
    type,
    alternativePhone
  }) {
    const userWithSamePhone = await this.studentRepository.findByPhone(phone);
    if (userWithSamePhone) {
      throw new PhoneAlreadyExistsError();
    }
    const userWithSameBI = await this.studentRepository.findByIdentityCardNumber(identityCardNumber);
    if (userWithSameBI) {
      throw new IdentityCardNumberAlreadyExistsError();
    }
    const findProvince = await this.provinceRepository.findById(provinceId);
    if (!findProvince) {
      throw new ProvinceNotFoundError();
    }
    const findCounty = await this.countyRepository.findById(countyId);
    if (!findCounty) {
      throw new CountyNotFoundError();
    }
    const student = await this.studentRepository.create({
      id,
      countyId,
      dateOfBirth,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      maritalStatus,
      mother,
      phone,
      provinceId,
      residence,
      type,
      alternativePhone
    });
    return {
      student
    };
  }
};

// src/repositories/prisma/prisma-province-repository.ts
var PrismaProvincesRepository = class {
  async findByName(name) {
    const findProvince = await prisma.province.findUnique({
      where: {
        name
      }
    });
    return findProvince;
  }
  async create(data) {
    let newProvince = await prisma.province.create({
      data: {
        name: data.name
      }
    });
    return newProvince;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    let provinces = await prisma.province.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return provinces;
  }
  async destroy(id) {
    let findProvince = await prisma.province.delete({
      where: {
        id
      }
    });
    return findProvince ? true : false;
  }
  async findById(id) {
    const province = await prisma.province.findUnique({
      where: {
        id
      }
    });
    return province;
  }
};

// src/repositories/prisma/prisma-county-repository.ts
var PrismaCountyRepository = class {
  async findByName(name) {
    const county = await prisma.county.findFirst({
      where: {
        name
      }
    });
    return county;
  }
  async create(data) {
    let county = await prisma.county.create({
      data: {
        name: data.name
      }
    });
    return county;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    let counties = await prisma.county.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return counties;
  }
  async destroy(id) {
    let county = await prisma.county.delete({
      where: {
        id
      }
    });
    return county ? true : false;
  }
  async findById(id) {
    const county = await prisma.county.findUnique({
      where: {
        id
      }
    });
    return county;
  }
};

// src/use-cases/factories/make-student-use-case.ts
function makeStudentUseCase() {
  const prismaStudentsRepository = new PrismaStudentsRepository();
  const prismaProvinceRepository = new PrismaProvincesRepository();
  const prismaCountyRepository = new PrismaCountyRepository();
  const createStudentUseCase = new CreateStudentUseCase(prismaStudentsRepository, prismaProvinceRepository, prismaCountyRepository);
  return createStudentUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeStudentUseCase
});
