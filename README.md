# Christo De Lange - Platform Engineering Portfolio

A dynamic Remotion-powered portfolio showcasing platform engineering achievements at Las Vegas Sands Corp.

## 🚀 Features

- **Animated Presentations**: 100-second video presentation with smooth animations
- **Data-Driven Content**: Automatically syncs data from the experience repository
- **Interactive Sections**: Hero, Timeline, Metrics, Architecture, and Contact sections
- **Automated Deployment**: GitHub Actions pipeline for continuous deployment
- **Multiple Formats**: Video (MP4) and interactive web versions

## 📊 Key Metrics Showcased

- **67 EKS Clusters** (from 1 manual cluster)
- **100k Lines of Code** (Platform CLI)
- **31 Self-Healing Patterns** (93% less manual work)
- **36 AWS Accounts** (Multi-account scale)
- **GreenPrint Architecture** (HA/DR system)

## 🛠️ Technology Stack

- **Remotion**: React-based video generation
- **TypeScript**: Type-safe development
- **React**: Component-based UI
- **GitHub Actions**: CI/CD pipeline
- **GitHub Pages**: Static hosting

## 📁 Project Structure

```
├── src/
│   ├── components/          # Remotion components
│   │   ├── HeroSection.tsx
│   │   ├── TimelineSection.tsx
│   │   ├── MetricsSection.tsx
│   │   ├── ArchitectureSection.tsx
│   │   └── ContactSection.tsx
│   ├── utils/
│   │   └── dataLoader.ts    # Data loading utilities
│   ├── types.ts            # TypeScript definitions
│   ├── Main.tsx            # Main composition
│   ├── Root.tsx            # Remotion root
│   └── index.ts            # Entry point
├── scripts/
│   └── sync-data.js        # Data synchronization script
├── data/                   # Synced data files
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions workflow
└── dist/                   # Built output
```

## 🔄 Data Synchronization

The portfolio automatically syncs data from the [experience repository](https://github.com/christokur/experience):

- `companies/las-vegas-sands/data/master-data.yaml`
- `companies/las-vegas-sands/data/timeline.json`
- `data/career-timeline.json`

### Manual Sync

```bash
npm run sync-data
```

### Automated Sync

The GitHub Actions workflow automatically syncs data during deployment.

## 🏗️ Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/christokur/portfolio.git
cd portfolio

# Install dependencies
npm install

# Sync data from experience repo
npm run sync-data

# Start Remotion studio
npm start
```

### Available Scripts

```bash
npm start          # Launch Remotion Studio
npm run build      # Build the video
npm run sync-data  # Sync data from experience repo
npm run deploy     # Sync data + build + deploy
```

## 🚀 Deployment

The portfolio is automatically deployed to GitHub Pages via GitHub Actions on every push to `main`.

### Manual Deployment

```bash
npm run deploy
```

## 📝 Content Sections

### 1. Hero Section (0-20s)
- Personal introduction
- Key statistics with animated counters
- Platform transformation overview

### 2. Metrics Section (20-40s)
- Scale metrics (clusters, accounts, developers)
- Efficiency improvements (time savings)
- Innovation highlights (code, patterns, architecture)

### 3. Timeline Section (40-60s)
- Platform evolution journey
- Major milestones from 2022-2024
- Achievement highlights

### 4. Architecture Section (60-80s)
- Six key architectural innovations
- Technical achievements
- Platform capabilities

### 5. Contact Section (80-100s)
- Professional contact information
- Social media links
- Portfolio repository

### 6. Content
#### Case Studies
- [Platform Transformation: Scaling from 1 to 67 EKS Clusters](./las-vegas-sands/case-studies/01-platform-transformation.md)
- [Self-Healing Infrastructure at Scale: 31 Patterns for Automated Recovery](./las-vegas-sands/case-studies/02-self-correcting-infrastructure-code.md)
- [The Compatibility Matrix: Solving Dependency Hell at Scale](./las-vegas-sands/case-studies/03-compatibility-matrix.md)
- [Blue-Green EKS Migrations: Zero-Downtime Cluster Updates at Scale](./las-vegas-sands/case-studies/04-blue-green.md)

#### Technical Blogs
- [The Four Pillars of Platform Engineering: A Unified Theory of Infrastructure](./las-vegas-sands/technical-blogs/01-cicd.md)
- [Solving Terraform at Scale: From Chaos to Control Across 67 Clusters](./las-vegas-sands/technical-blogs/02-terraform.md)
- [Bricks: Building Composable Configuration Management at Scale](./las-vegas-sands/technical-blogs/03-bricks.md)
- [AI-Powered Platform Engineering: From Troubleshooting to Documentation](./las-vegas-sands/technical-blogs/04-ai-pe.md)

## 📧 Contact

- **Email**: portfolio@christodelange.com
- **LinkedIn**: [christo-de-lange-09134b5](https://www.linkedin.com/in/christo-de-lange-09134b5/)
- **GitHub**: [christokur](https://github.com/christokur)
- **Portfolio**: [christokur](https://christokur.github.io/portfolio/)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

**Platform Engineering • Cloud Architecture • DevOps Excellence**  
*Las Vegas Sands Corp • Senior Cloud Platform Engineer*