# Platform Transformation: Scaling from 1 to 67 EKS Clusters

## Executive Summary

Over three years at Las Vegas Sands Corp, I led a complete platform transformation that scaled infrastructure from a single manually-managed EKS cluster to 67 fully automated clusters across 36 AWS accounts. This case study details the journey, challenges, solutions, and outcomes of building a comprehensive cloud platform from scratch.

## The Challenge

### Initial State (August 2022)
- **Single EKS cluster** manually configured in one AWS account
- **Click-ops deployments** taking days to complete
- **No standardization** across environments
- **High error rates** due to manual processes
- **Limited visibility** into deployment status
- **Scaling bottleneck** preventing business growth

### Business Requirements
- Support rapid application development across multiple teams
- Enable reliable deployments to multiple environments
- Reduce time-to-market for new features
- Ensure compliance and security across all environments
- Minimize operational overhead

## The Solution

### Platform Architecture

I designed a comprehensive platform architecture based on four key principles:

1. **Everything as Code** - All infrastructure, configuration, and deployments
2. **Self-Service** - Developers shouldn't need platform team for deployments
3. **Self-Healing** - Automatic recovery from common failures
4. **Observability** - Complete visibility into all operations

### Core Components Built

#### 1. b2b-cli: The Platform Orchestration Tool
- **100,000+ lines** of Python code
- **12 custom SDKs** for service integration
- **Multi-deployment support** (Kubernetes, S3, DNS)
- **Parallel operations** across accounts and regions

```python
# Example: Environment creation with single command
$ b2b environment create --name feature-xyz --type dev --class application

# Parallel cluster discovery across accounts
$ b2b environment list --source eks --regions us-east-1,us-west-2 --output table
```

#### 2. Loosely Coupled Infrastructure
Solved Terraform's circular dependency problem:
- State data imports instead of direct references
- Independent stack lifecycle management
- Clean separation of concerns

```hcl
# Instead of direct references that create dependencies:
# resource "aws_security_group" "app" {
#   vpc_id = aws_vpc.main.id  # Direct reference
# }

# Use data sources for loose coupling:
data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    bucket = "terraform-state"
    key    = "vpc/terraform.tfstate"
  }
}

resource "aws_security_group" "app" {
  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
}
```

#### 3. Bricks Configuration System
Revolutionary approach to configuration management:
- Composable configuration blocks
- Version-controlled templates
- Environment parity guaranteed
- DRY principles applied

```yaml
# Example brick composition
metadata:
  type: environment
  version: 0.35.220

ldx:
  include_brick:
    - template: bricks/llc-ldx-dev-v3.yaml
      attributes:
        version: 2025-07-15-0014_main_38cf0f3f6
        features:
          database_admin: true
          deployment_api: true
    - template: bricks/common/ldx/user-databases.yaml
```

#### 4. Self-Healing Infrastructure
31 automated recovery patterns:
- Pattern-based error detection
- Automated remediation
- Configurable recovery strategies
- Learning system for new patterns

## Implementation Journey

### Phase 1: Foundation (Q4 2022 - Q1 2023)
- Ramp-up and learning inherited systems
- Embedded Python automation code in infrastructure
- First Terraform modules development
- Moving away from click-ops approach

**Key Milestone**: First automated environment deployment in 2 hours vs 3 days manual

### Phase 2: Architecture Evolution (Q2 2023)
- TerraGrant experimentation to TerraMate conversion
- GreenPrint (loosely coupled stacks) architecture design
- GitOps V2 development begins
- DNS delegation system implementation
- AFT and Control Tower management takeover

**Key Achievement**: Cross-account DNS delegation eliminating manual DNS management

### Phase 3: GreenPrint System (Q3 2023)
- GreenPrint V3 infrastructure fully implemented
- Primary/secondary region HA/DR architecture baked into platform DNA
- Blue-green EKS migrations enabled by dual-region design
- Firefly drift detection tool implementation
- Platform scaling acceleration begins

**Breakthrough**: Enterprise-grade HA/DR architecture built into platform foundation

### Phase 4: B2B CLI Productization (Q4 2023)
- B2B CLI extracted as standalone product (November 2023)
- Fixer system built-in from day one (31 self-healing patterns)
- Bricks configuration system
- Team cross-training begins

**Innovation**: Self-healing platform with automated recovery patterns

### Phase 5: Team Scale & Multi-Deployment (Q1-Q2 2024)
- Team fully cross-trained and productive
- GitOps V2 reaches full maturity
- S3/CloudFront deployment pattern for lobby client
- Multi-deployment type support added to B2B CLI
- Database admin component
- Deployment Info API
- Massive scaling demand begins

**Breakthrough**: Multi-deployment types breaking SPA-to-Kubernetes pattern

### Phase 6: Platform Excellence & Security (Q3-Q4 2024)
- Peak cluster scale achieved (67 clusters)
- Akuity enterprise ArgoCD trial and implementation
- OIDC provider implementation for GitHub Actions
- Static credentials replaced with temporary STS credentials
- Fine-grained per-repo AWS permissions
- Compatibility matrix system
- Application manifests for promotion gates
- AI integration started
- IDP vision development

**Innovation**: Temporal compatibility matrix preventing deployment failures

## Key Innovations

### 1. Blue-Green EKS Migrations
Instead of in-place upgrades:
- Spin up new cluster with updates
- Migrate workloads seamlessly
- Switch traffic via DNS/LB
- Tear down old cluster

Result: Zero-downtime upgrades

```bash
# Blue-green migration workflow
$ b2b environment create --name prod-blue --copy-from prod-green
$ b2b deployment migrate --from prod-green --to prod-blue
$ b2b dns switch --record prod.app.com --to prod-blue
$ b2b environment destroy --name prod-green --safety-check
```

### 2. Cross-Account DNS Delegation
Automated subdomain management across 36 accounts:
- No cross-account permissions needed
- Branch-per-environment strategy
- Automated certificate provisioning
- Complete DNS automation

```yaml
# DNS delegation structure
production_account:
  hosted_zone: apps.company.com
  delegations:
    - subdomain: staging.apps.company.com
      target_account: staging_account
    - subdomain: dev.apps.company.com
      target_account: dev_account
```

### 3. Database Admin Component
Zero-touch database provisioning:
- Automatic database creation
- Credential generation and distribution
- Convention-based secret placement
- Complete automation

```yaml
# Database configuration in bricks
databases:
  main:
    type: postgresql
    size: db.t3.medium
    applications:
      - name: backend-api
        database: api_db
        secret_namespace: backend
      - name: analytics
        database: analytics_db
        secret_namespace: analytics
```

### 4. The Fixer System in Action
Real example of self-healing:

```yaml
# Fixer configuration for S3 versioning race condition
converge:
  - errors:
      - "Error: error enabling versioning for S3 bucket"
      - "InvalidBucketState: Versioning cannot be enabled"
    fixes:
      - _wait_a_minute_and_retry
    goals: ["apply"]
    stacks: ["=s3-buckets"]
    
  - errors:
      - "ResourceInUseException: Cluster has nodegroups attached"
    fixes:
      - _remove_eks_nodegroups
      - _wait_and_retry
    goals: ["destroy"]
    stacks: ["=eks-layer1"]
```

## Outcomes and Impact

### Quantifiable Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| EKS Clusters | 1 | 67 | 6,700% increase |
| AWS Accounts | 1 | 36 | 3,600% increase |
| Environment Creation | 3 days | 1 hour | 98% reduction |
| Deployment Time | Hours | Minutes | 95% reduction |
| Manual Interventions/Week | 50+ | <5 | 90% reduction |
| Failed Deployments | 30% | <2% | 93% reduction |
| MTTR | Hours | Minutes | 85% reduction |

### Business Impact
- **Time to Market**: Reduced by 90%
- **Developer Satisfaction**: Increased from 3/10 to 9/10 (survey)
- **Operational Overhead**: Reduced by 80%
- **Compliance**: 100% infrastructure as code
- **Innovation**: Enabled rapid experimentation

### Cost Optimization
- **Infrastructure costs**: 30% reduction through consolidation
- **Operational costs**: 70% reduction in platform team time
- **Incident costs**: 80% reduction in outage-related losses

## Lessons Learned

### What Worked Well
1. **Loosely coupled architecture** provided flexibility for growth
2. **Configuration as code** ensured consistency across environments
3. **Self-healing patterns** dramatically reduced operational burden
4. **GitOps workflow** enabled reliable, auditable deployments
5. **Parallel processing** made multi-account operations feasible

### Challenges Overcome

#### Challenge 1: Terraform State Dependencies
**Problem**: Circular dependencies causing deployment and teardown failures
**Solution**: Implemented loosely coupled stacks with state data imports
**Result**: Independent stack lifecycle management

#### Challenge 2: Stateful Services
**Problem**: Applications maintaining in-memory state prevented scaling
**Solution**: Blue-green cluster migrations instead of in-place updates
**Result**: Zero-downtime upgrades despite stateful constraints

#### Challenge 3: Configuration Drift
**Problem**: Environments diverging over time
**Solution**: Bricks composition system with version control
**Result**: Guaranteed environment parity

#### Challenge 4: Knowledge Gaps
**Problem**: Developers unsure what versions work together
**Solution**: Compatibility matrix with temporal versioning
**Result**: Prevented incompatible deployments

### What I'd Do Differently
1. **Start with GitOps from day one** - Would have prevented early manual processes
2. **Implement compatibility checking earlier** - Would have prevented many failed deployments
3. **Build API interface sooner** - Would have enabled self-service faster
4. **Document patterns more aggressively** - Would have accelerated team adoption
5. **Avoid EKS Blueprints** - Too rigid, caused technical debt

## Technical Deep Dive

### The Fixer System Architecture
```python
class TerraformFixer:
    def __init__(self):
        self.fixers = self._load_fixer_config()
        
    def detect_and_fix(self, terraform_output, context):
        for pattern in self.fixers:
            if self._matches_pattern(terraform_output, pattern['errors']):
                for fix in pattern['fixes']:
                    self._apply_fix(fix, context)
                return True
        return False
        
    def _apply_fix(self, fix_name, context):
        # Map of fix implementations
        fixes = {
            '_wait_and_retry': lambda: time.sleep(60),
            '_remove_eks_nodegroups': self._cleanup_nodegroups,
            '_refresh_aws_credentials': self._refresh_sso,
            # ... 28 more fixes
        }
        fixes[fix_name](context)
```

### Bricks Composition Example
```yaml
# Base brick for all environments
base:
  vpc:
    cidr: 10.0.0.0/16
    availability_zones: 3
  
  include_brick:
    - template: bricks/networking.yaml
    - template: bricks/security.yaml

# Development environment overlay
dev:
  include_brick:
    - template: bricks/base.yaml
    - template: bricks/eks-minimal.yaml
      attributes:
        node_count: 2
        instance_type: t3.medium

# Production environment overlay  
prod:
  include_brick:
    - template: bricks/base.yaml
    - template: bricks/eks-production.yaml
      attributes:
        node_count: 10
        instance_type: m5.xlarge
        multi_az: true
```

### Deployment Manifest Structure
```yaml
metadata:
  deployment:
    application_name: live-dealer
    helm_charts_version: SRE-223
    
applications:
  backend:
    version: v2.3.45
    deployment_type: kubernetes
    namespace: backend
    
  frontend:
    version: v1.2.33
    deployment_type: s3
    bucket: ${environment}-frontend
    cloudfront: true
    
  database:
    deployment_type: rds
    engine: postgresql
    version: 14.7
```

## Platform Architecture Evolution

### Initial Architecture (2022)
```
Developer → Manual AWS Console → Single EKS Cluster → Application
```

### Current Architecture (2025)
```
Developer → Git Push → GitHub Actions → b2b-cli → 
  ├─→ Terraform/TerraMate → AWS Infrastructure (36 accounts)
  ├─→ ArgoCD → EKS Clusters (67)
  ├─→ S3/CloudFront → Static Content
  └─→ Route53 → DNS Management
```

## Future Vision

The platform continues to evolve toward a complete Internal Developer Platform:

### Near-term Goals (Q1-Q2 2025)
- API-driven platform services
- Web UI for self-service environment creation
- Enhanced AI-assisted operations
- Automated compliance scanning

### Long-term Vision (2025-2026)
- Complete developer autonomy
- Predictive scaling and optimization
- Self-documenting infrastructure
- Automated security remediation

## Conclusion

This platform transformation demonstrates what's possible when combining architectural vision, deep technical expertise, and relentless focus on automation. The result is a self-operating, self-healing platform that fundamentally changed how Las Vegas Sands delivers software.

### Key Takeaways

1. **Start with loose coupling** - It provides flexibility for growth and prevents lock-in
2. **Automate recovery, not just deployment** - Self-healing systems reduce operational burden significantly
3. **Standardize through code** - Configuration as code ensures consistency and enables version control
4. **Enable self-service** - Developer autonomy accelerates delivery and innovation
5. **Build for scale from day one** - Design patterns that grow with demand
6. **Measure everything** - Metrics drive continuous improvement
7. **Document patterns** - Knowledge sharing accelerates adoption

### Impact Statement

As the sole platform architect, I designed and implemented this entire system while:
- Supporting 100+ developers across multiple teams
- Training platform team members on tools and processes
- Maintaining 99.9% platform availability
- Reducing operational costs by millions annually
- Enabling the business to scale 10x without proportional infrastructure investment

This transformation wasn't just about technology - it was about enabling business agility, developer productivity, and operational excellence at scale.

---

*For more technical details, see the [Architecture Documentation](/architecture) and [Code Samples](/code-samples) sections of this portfolio.*