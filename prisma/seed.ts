import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with AI business projects...");

  // Clear existing data
  await prisma.featureRequest.deleteMany();
  await prisma.contractDocument.deleteMany();
  await prisma.project.deleteMany();
  await prisma.freelancerProfile.deleteMany();

  // Create a freelancer profile
  const profile = await prisma.freelancerProfile.create({
    data: {
      role: "AI/ML Engineer & Full-Stack Developer",
      yearsExperience: 6,
      hourlyRate: 85,
      skills: JSON.stringify([
        "Python",
        "TensorFlow",
        "PyTorch",
        "Node.js",
        "React",
        "TypeScript",
        "FastAPI",
        "LLM Integration",
        "RAG Systems",
        "AWS",
        "Docker",
      ]),
    },
  });

  console.log("✅ Created freelancer profile:", profile.id);

  // Project 1: AI Customer Service Platform
  const project1 = await prisma.project.create({
    data: {
      name: "AI Customer Service Platform",
      description:
        "A comprehensive customer service platform powered by AI, including chatbot, ticketing system, and sentiment analysis.",
    },
  });

  const contract1 = await prisma.contractDocument.create({
    data: {
      projectId: project1.id,
      rawText: `AI CUSTOMER SERVICE PLATFORM - PROJECT SCOPE & CONTRACT

PROJECT OVERVIEW:
The Client requires development of an AI-powered customer service platform with the following core components:

1. CHATBOT SYSTEM
- Multi-turn conversational AI chatbot using LLM (GPT-4 or Claude)
- Natural language understanding and generation
- Integration with customer database for personalization
- Support for 5+ languages
- Daily active user capacity: 10,000
- 99.5% uptime SLA

2. TICKET MANAGEMENT SYSTEM
- Create, read, update, delete (CRUD) functionality for customer support tickets
- Automatic ticket routing based on AI categorization
- Priority assignment using sentiment analysis
- Agent dashboard with ticket queue management
- Email integration for ticket creation and updates

3. ANALYTICS & REPORTING
- Real-time dashboard showing customer satisfaction metrics
- Response time analytics
- Resolution rate tracking
- Monthly trend reports in PDF format

4. DATABASE AND INFRASTRUCTURE
- PostgreSQL database with proper indexing
- Redis cache layer for performance
- Docker containerization
- AWS deployment (EC2, RDS, ElastiCache)
- CI/CD pipeline using GitHub Actions

5. EXCLUDED FROM SCOPE
- Mobile applications (iOS/Android) - Out of scope
- Advanced ML model training on proprietary data - Out of scope
- Third-party payment integration - Out of scope
- Video support in chatbot - Out of scope
- Social media channel integration - Out of scope

6. TIMELINE & DELIVERABLES
- Phase 1 (Months 1-2): Chatbot MVP + Ticket System
- Phase 2 (Months 2-3): Analytics Dashboard + Database Setup
- Phase 3 (Months 3-4): Deployment & Performance Optimization
- Bi-weekly delivery sprints with demo sessions

INCLUDED SUPPORT:
- 3 months of post-deployment support and bug fixes
- Documentation and knowledge transfer
- Performance optimization guidance

NOT INCLUDED:
- Ongoing maintenance beyond 3 months
- Custom ML model training
- Production data migration services`,
    },
  });

  console.log("✅ Created Project 1:", project1.id);

  // Project 2: Document Processing with AI
  const project2 = await prisma.project.create({
    data: {
      name: "Intelligent Document Processing System",
      description:
        "Enterprise document processing platform using OCR and NLP for automatic data extraction.",
    },
  });

  const contract2 = await prisma.contractDocument.create({
    data: {
      projectId: project2.id,
      rawText: `INTELLIGENT DOCUMENT PROCESSING SYSTEM - PROJECT SCOPE

PROJECT OBJECTIVE:
Build an end-to-end document processing system that extracts structured data from unstructured documents using AI/ML.

CORE FEATURES INCLUDED:
1. DOCUMENT UPLOAD & STORAGE
   - Support for PDF, JPEG, PNG, DOCX files
   - Secure S3 storage with encryption
   - Document versioning and audit trail

2. OCR (OPTICAL CHARACTER RECOGNITION)
   - Multi-language OCR support (English, German, French, Dutch)
   - Text extraction with confidence scores
   - Table detection and extraction
   - Handwriting recognition

3. NLP DATA EXTRACTION
   - Named Entity Recognition (NER) for extracting entities
   - Invoice field extraction: amount, date, vendor, line items
   - Contract extraction: key terms, dates, parties, obligations
   - Custom entity extraction for domain-specific documents
   - Confidence scoring per extracted field

4. WORKFLOW AUTOMATION
   - Document classification (invoice, contract, receipt, permit)
   - Automatic routing to appropriate teams
   - Validation rules and manual review queue
   - Processing status tracking and notifications

5. API & INTEGRATION
   - RESTful API for document submission
   - Webhook callbacks for processing completion
   - Integration with client's ERP system
   - Rate limiting and usage analytics

6. MACHINE LEARNING & CONTINUOUS IMPROVEMENT
   - Model training pipeline for improving accuracy
   - A/B testing framework for model versions
   - Feedback loop for manual corrections

EXCLUDED FROM THIS PROJECT:
- Real-time video document capture - Out of scope
- Blockchain integration for document verification - Out of scope
- Custom model training on client's proprietary documents - Out of scope
- Mobile app development - Out of scope
- Document signature verification - Out of scope

DEPLOYMENT & SECURITY:
- Dockerized microservices architecture
- Kubernetes for orchestration
- Role-based access control (RBAC)
- Compliance: GDPR, SOC2
- Automated backups and disaster recovery

SUPPORT & MAINTENANCE:
- 6 months post-launch support included
- Monthly performance reviews
- Quarterly model accuracy assessments`,
    },
  });

  console.log("✅ Created Project 2:", project2.id);

  // Project 3: AI-Powered Recommendation Engine
  const project3 = await prisma.project.create({
    data: {
      name: "AI Recommendation Engine",
      description:
        "Personalized recommendation system for e-commerce using collaborative filtering and content-based algorithms.",
    },
  });

  const contract3 = await prisma.contractDocument.create({
    data: {
      projectId: project3.id,
      rawText: `AI RECOMMENDATION ENGINE - PROJECT SCOPE & REQUIREMENTS

OBJECTIVE:
Develop a scalable recommendation engine that provides personalized product recommendations to increase conversion rates and AOV.

IN-SCOPE DELIVERABLES:

1. RECOMMENDATION ALGORITHMS
   - Collaborative filtering (user-user and item-item)
   - Content-based filtering
   - Hybrid recommendation approach
   - Cold-start problem handling
   - Real-time recommendation serving (<100ms latency)

2. DATA INFRASTRUCTURE
   - Event tracking system for user behaviors
   - Feature engineering pipeline
   - Vector database for embeddings (Pinecone/Weaviate)
   - Model training infrastructure
   - A/B testing framework

3. PERSONALIZATION FEATURES
   - User segmentation and cohort analysis
   - Dynamic ranking based on user behavior
   - Seasonal trend detection
   - Cross-sell and upsell recommendations
   - Time-aware recommendations

4. API & FRONTEND INTEGRATION
   - High-performance REST API
   - GraphQL endpoint for complex queries
   - JavaScript SDK for frontend integration
   - Admin dashboard for campaign management
   - Analytics and monitoring dashboards

5. PERFORMANCE & RELIABILITY
   - Distributed caching with Redis
   - Model serving with TensorFlow Serving
   - Horizontal scaling support
   - 99.9% uptime SLA
   - Comprehensive logging and monitoring

OUT-OF-SCOPE ITEMS:
- Mobile application development - Out of scope
- Real-time personalization messaging system - Out of scope  
- Customer segmentation module using external data sources - Out of scope
- Price optimization algorithms - Out of scope
- Fraud detection integration - Out of scope

TIMELINE:
- Weeks 1-2: Infrastructure setup and data pipeline
- Weeks 3-6: Algorithm development and training
- Weeks 7-8: API development and integration
- Weeks 9-10: Testing, optimization, and deployment
- Week 11-12: Monitoring and performance tuning`,
    },
  });

  console.log("✅ Created Project 3:", project3.id);

  // Add some feature requests for each project
  const features = [
    {
      projectId: project1.id,
      description:
        "Add support for voice-based interaction in the chatbot - customers should be able to call in and interact with the AI voice assistant",
      expectedStatus: "out_of_scope",
    },
    {
      projectId: project1.id,
      description:
        "Implement sentiment analysis on customer support tickets to automatically flag negative sentiment and escalate to senior agents",
      expectedStatus: "in_scope",
    },
    {
      projectId: project1.id,
      description:
        "Create a WhatsApp integration so customers can chat with the bot through WhatsApp Business API",
      expectedStatus: "out_of_scope",
    },
    {
      projectId: project2.id,
      description:
        "Build a module to extract data from medical insurance documents and categorize claims",
      expectedStatus: "partial",
    },
    {
      projectId: project2.id,
      description:
        "Add machine learning model training capability to improve OCR accuracy on custom document types",
      expectedStatus: "out_of_scope",
    },
    {
      projectId: project3.id,
      description:
        "Implement real-time product recommendation personalization based on current user session behavior",
      expectedStatus: "in_scope",
    },
    {
      projectId: project3.id,
      description:
        "Add dynamic pricing optimization based on demand and inventory levels",
      expectedStatus: "out_of_scope",
    },
  ];

  console.log(
    "\n📝 Feature requests would be added here (requires LLM evaluation)",
  );
  console.log(
    "   Run feature evaluations through the API to populate aiResponse",
  );

  console.log("\n🎉 Database seed completed successfully!");
  console.log(`
✅ Created ${1} freelancer profile
✅ Created ${3} AI business projects:
   - AI Customer Service Platform
   - Intelligent Document Processing System
   - AI Recommendation Engine
✅ Created ${3} detailed scope contracts

📊 Next steps:
1. Start the application
2. Create/update your profile with your skills and rate
3. Navigate to projects and create feature requests
4. The AI model will evaluate each request against the contract scope
5. View detailed scope analysis with contract citations
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
