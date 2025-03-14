# CV Generator

Без env файла swagger будет доступен по адресу: http://localhost:3000/cv/docs

Формат данных для отправки на роут в CV Generator:
{
  "template": "modern",
  "language": "ru",
  "fullName": "Иван Иванов",
  "position": "Senior Full Stack Developer",
  "email": "ivan@example.com",
  "phone": "+7 999 123 45 67",
  "summary": "Опытный разработчик с 5-летним стажем...",
  "workExperience": [
    {
      "company": "Tech Company",
      "position": "Senior Developer",
      "startDate": "2020-01",
      "endDate": "present",
      "responsibilities": [
        "Разработка микросервисной архитектуры",
        "Управление командой из 5 разработчиков"
      ]
    }
  ],
  "education": [
    {
      "institution": "Технический Университет",
      "degree": "Магистр",
      "specialization": "Компьютерные науки",
      "startDate": "2014",
      "endDate": "2016"
    }
  ],
  "skills": ["JavaScript", "TypeScript", "Node.js", "React", "PostgreSQL"],
  "languages": ["Русский (родной)", "English (B2)"]
}

## Шаблоны для CV
modern
minimal
professional
creative