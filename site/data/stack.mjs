// Các công nghệ trong lộ trình, nhóm theo tầng. "ph" là giai đoạn học chính (khớp với curriculum/).
// Logo: nếu có file site/assets/stack/<slug>.svg (logo chính thức, dùng đúng quy định của từng hãng) thì hub hiện kèm.
export const STACK = [
  { group: "ngon-ngu", label: "Ngôn ngữ", items: [
    ["java-21", "Java 21", "gd1"], ["sql", "SQL", "gd1"], ["javascript", "JavaScript", "gd3"], ["typescript", "TypeScript", "gd3"],
  ] },
  { group: "backend", label: "Backend", items: [
    ["spring-boot-3", "Spring Boot 3", "gd2"], ["spring-security", "Spring Security", "gd2"], ["spring-data-jpa", "Spring Data JPA", "gd2"],
    ["hibernate", "Hibernate", "gd2"], ["maven", "Maven", "gd1"], ["junit-5", "JUnit 5", "gd1"], ["testcontainers", "Testcontainers", "gd2"],
  ] },
  { group: "frontend", label: "Frontend", items: [
    ["react", "React", "gd3"], ["redux-toolkit", "Redux Toolkit", "gd3"], ["rtk-query", "RTK Query", "gd3"], ["vite", "Vite", "gd3"],
    ["tailwind-css", "Tailwind CSS", "gd3"], ["react-router", "React Router", "gd3"],
  ] },
  { group: "du-lieu", label: "Dữ liệu", items: [
    ["postgresql", "PostgreSQL", "gd1"], ["redis", "Redis", "gd2"], ["minio", "MinIO", "gd2"], ["pgvector", "pgvector", "gd4"], ["kafka", "Kafka", "gd6"],
  ] },
  { group: "ai", label: "AI", items: [
    ["llm-api", "LLM API", "gd4"], ["rag", "RAG", "gd4"], ["mcp", "MCP", "gd4"], ["spring-ai", "Spring AI", "gd4"], ["langchain4j", "LangChain4j", "gd4"], ["langfuse", "Langfuse", "gd4"],
  ] },
  { group: "devops", label: "DevOps", items: [
    ["linux", "Linux", "gd1"], ["git", "Git", "gd1"], ["docker", "Docker", "gd5"], ["nginx", "Nginx", "gd5"], ["github-actions", "GitHub Actions", "gd5"],
    ["prometheus", "Prometheus", "gd5"], ["grafana", "Grafana", "gd5"], ["kubernetes", "Kubernetes", "gd5"],
  ] },
  { group: "kien-truc", label: "Kiến trúc", items: [
    ["uml", "UML", "gd2"], ["c4-model", "C4 model", "gd2"], ["microservices", "Microservices", "gd6"], ["spring-cloud", "Spring Cloud", "gd6"],
    ["webflux", "WebFlux", "gd6"], ["resilience4j", "Resilience4j", "gd6"], ["saga", "Saga", "gd6"],
  ] },
];
