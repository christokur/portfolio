# Bricks: Building Composable Configuration Management at Scale

## Introduction

Configuration management at scale is where most platforms fail. YAML files sprawl, environments drift, and developers copy-paste their way to chaos. At Las Vegas Sands, I invented the "Bricks" system—a composable, versioned configuration management approach that treats configuration like LEGO blocks. This system eliminated configuration drift across 67 clusters and made environment parity not just possible, but inevitable.

## The Configuration Crisis

### The Copy-Paste Pandemic

This was our reality before Bricks:

```yaml
# dev-environment.yaml (2,847 lines)
kubernetes:
  version: 1.24
  nodes: 3
  instance_type: t3.medium
  # ... 500 more lines

database:
  engine: postgresql
  version: 13
  # ... 300 more lines

# staging-environment.yaml (2,891 lines)
kubernetes:
  version: 1.24  # Or was it 1.25? Who knows?
  nodes: 5
  instance_type: t3.large
  # ... 500 more lines with subtle differences

# production-environment.yaml (3,124 lines)
# Good luck finding what's different!
```

### The Real Cost

- **Configuration files**: 200+ with 500,000+ lines total
- **Drift between environments**: 40% divergence
- **Time to update all environments**: 2-3 days
- **Errors from inconsistency**: 30% of incidents
- **Developer confusion**: "Which config do I copy?"

## The Bricks Philosophy

### Core Concept: Composable Configuration

```yaml
# Think LEGO, not monoliths
brick_system:
  principles:
    - "Small, focused, reusable pieces"
    - "Composition over inheritance"
    - "Version everything"
    - "Template with intelligence"
    - "Test like code"
```

### What Makes a Brick?

A brick is:
1. **Atomic** - Does one thing well
2. **Composable** - Combines with other bricks
3. **Versioned** - Has a specific version
4. **Parameterized** - Accepts variables
5. **Testable** - Can be validated

## The Bricks Architecture

### Basic Brick Structure

```yaml
# bricks/kubernetes/base.yaml
metadata:
  name: kubernetes-base
  version: 1.2.0
  description: Base Kubernetes configuration
  compatible_with: ">=1.0.0"

configuration:
  kubernetes:
    version: "{kubernetes_version|default:1.27}"
    networking:
      pod_cidr: "10.244.0.0/16"
      service_cidr: "10.245.0.0/16"
    
include_brick:
  - template: "monitoring/prometheus.yaml"
    when: "{monitoring_enabled|default:true}"
  - template: "logging/fluentd.yaml"
    when: "{logging_enabled|default:true}"

outputs:
  cluster_version: "{kubernetes.version}"
  api_endpoint: "{kubernetes.endpoint}"
```

### Brick Composition

```yaml
# environments/production.yaml
metadata:
  environment: production
  version: 2.0.0

composition:
  # Layer 1: Base infrastructure
  - brick: infrastructure/network
    version: ">=1.5.0"
    parameters:
      vpc_cidr: "10.0.0.0/16"
      availability_zones: 3
      
  # Layer 2: Kubernetes
  - brick: kubernetes/base
    version: ">=1.2.0"
    parameters:
      kubernetes_version: "1.27"
      node_count: 10
      
  # Layer 3: Applications
  - brick: applications/microservices
    version: ">=2.0.0"
    parameters:
      replicas: 3
      auto_scaling: true
```

## Implementation Deep Dive

### The Brick Engine

```python
class BrickEngine:
    """The core of the Bricks system"""
    
    def __init__(self, brick_repository):
        self.repo = brick_repository
        self.cache = {}
        self.validator = BrickValidator()
        
    def compose(self, manifest):
        """Compose a complete configuration from bricks"""
        
        result = Configuration()
        
        # Process each brick in order
        for brick_spec in manifest['composition']:
            brick = self.load_brick(
                name=brick_spec['brick'],
                version=brick_spec['version']
            )
            
            # Apply parameters
            brick = self.apply_parameters(brick, brick_spec['parameters'])
            
            # Handle conditional includes
            brick = self.process_includes(brick)
            
            # Merge into result
            result.merge(brick)
            
        # Validate final configuration
        self.validator.validate(result)
        
        return result
        
    def load_brick(self, name, version):
        """Load a brick with version resolution"""
        
        cache_key = f"{name}:{version}"
        
        if cache_key not in self.cache:
            # Resolve version
            resolved_version = self.resolve_version(name, version)
            
            # Load brick content
            brick_content = self.repo.get_brick(name, resolved_version)
            
            # Parse and validate
            brick = self.parse_brick(brick_content)
            self.validator.validate_brick(brick)
            
            self.cache[cache_key] = brick
            
        return deepcopy(self.cache[cache_key])
```

### Recursive Composition

```python
class BrickComposer:
    """Handle recursive brick composition"""
    
    def process_includes(self, brick, context=None, depth=0):
        """Process include_brick directives recursively"""
        
        if depth > self.MAX_DEPTH:
            raise RecursionError("Brick inclusion depth exceeded")
            
        if 'include_brick' not in brick:
            return brick
            
        for include in brick['include_brick']:
            # Check conditions
            if not self.evaluate_condition(include.get('when'), context):
                continue
                
            # Check accepted kinds
            if not self.matches_kind(include.get('accepted_kinds'), context):
                continue
                
            # Load included brick
            included = self.load_brick(include['template'])
            
            # Apply attributes (parameters)
            if 'attributes' in include:
                included = self.apply_attributes(included, include['attributes'])
                
            # Recursive processing
            included = self.process_includes(included, context, depth + 1)
            
            # Merge into parent brick
            brick = self.merge_bricks(brick, included)
            
        return brick
```

### Template Processing

```python
class TemplateProcessor:
    """Process template variables in bricks"""
    
    def __init__(self):
        self.env = Environment()
        self.functions = self.load_template_functions()
        
    def process(self, content, context):
        """Process all template variables"""
        
        if isinstance(content, dict):
            return {k: self.process(v, context) for k, v in content.items()}
        elif isinstance(content, list):
            return [self.process(item, context) for item in content]
        elif isinstance(content, str):
            return self.expand_template(content, context)
        else:
            return content
            
    def expand_template(self, template, context):
        """Expand template variables"""
        
        # Handle {variable|default:value} syntax
        pattern = r'\{([^}]+)\}'
        
        def replacer(match):
            expr = match.group(1)
            
            # Parse variable and default
            if '|' in expr:
                var_path, default_expr = expr.split('|', 1)
                if default_expr.startswith('default:'):
                    default_value = default_expr[8:]
                else:
                    default_value = None
            else:
                var_path = expr
                default_value = None
                
            # Resolve variable
            value = self.resolve_variable(var_path, context)
            
            if value is None and default_value is not None:
                value = default_value
                
            return str(value) if value is not None else match.group(0)
            
        return re.sub(pattern, replacer, template)
```

## Advanced Features

### 1. Conditional Inclusion

```yaml
# Include bricks based on conditions
include_brick:
  # Environment-based
  - template: bricks/production-only.yaml
    when: "{environment_type} == 'production'"
    
  # Feature flags
  - template: bricks/new-feature.yaml
    when: "{feature_flags.new_feature_enabled}"
    
  # Complex conditions
  - template: bricks/high-availability.yaml
    when: "{node_count} > 5 and {environment_type} in ['staging', 'production']"
```

### 2. Attribute Inheritance

```yaml
# Parent brick defines defaults
defaults:
  monitoring:
    enabled: true
    retention: 30d
    
# Child brick inherits and overrides
include_brick:
  - template: bricks/monitoring.yaml
    attributes:
      retention: 90d  # Override default
      # 'enabled' is inherited as true
```

### 3. Version Compatibility

```python
class VersionResolver:
    """Resolve brick versions with constraints"""
    
    def resolve(self, brick_name, constraint):
        """Find best version matching constraint"""
        
        available = self.repo.get_versions(brick_name)
        
        # Parse constraint (e.g., ">=1.2.0,<2.0.0")
        spec = VersionSpec(constraint)
        
        # Find matching versions
        matching = [v for v in available if spec.match(v)]
        
        if not matching:
            raise NoMatchingVersion(f"{brick_name} has no version matching {constraint}")
            
        # Return highest matching version
        return max(matching)
        
    def check_compatibility(self, brick, manifest):
        """Verify brick compatibility with manifest"""
        
        if 'compatible_with' in brick.metadata:
            manifest_version = manifest.get('version')
            if not VersionSpec(brick.metadata.compatible_with).match(manifest_version):
                raise IncompatibleBrick(
                    f"{brick.name} requires manifest version {brick.metadata.compatible_with}"
                )
```

### 4. Multi-Level Composition

```yaml
# Level 1: Base brick
base_networking:
  vpc:
    cidr: "10.0.0.0/16"
    
# Level 2: Environment class brick
include_brick:
  - template: base_networking
  
production_class:
  vpc:
    enable_flow_logs: true
    nat_gateways: 3
    
# Level 3: Specific environment
include_brick:
  - template: production_class
  
production_us_east:
  vpc:
    region: us-east-1
    availability_zones: ["us-east-1a", "us-east-1b", "us-east-1c"]
```

## Real-World Examples

### Example 1: Database Configuration Brick

```yaml
# bricks/database/postgresql.yaml
metadata:
  name: postgresql-database
  version: 2.1.0
  description: PostgreSQL RDS configuration
  
parameters:
  - name: instance_class
    type: string
    default: "db.t3.medium"
    validation: "^db\\.(t3|m5|r5)\\.(micro|small|medium|large|xlarge)$"
    
  - name: storage_size
    type: integer
    default: 100
    validation: "min:20,max:64000"
    
configuration:
  database:
    engine: postgresql
    version: "{postgres_version|default:14}"
    instance_class: "{instance_class}"
    storage:
      size: "{storage_size}"
      type: "{storage_type|default:gp3}"
      encrypted: true
      
    backup:
      retention: "{backup_retention|default:7}"
      window: "{backup_window|default:03:00-04:00}"
      
    monitoring:
      enabled: true
      interval: 60
      
include_brick:
  - template: security/database-security.yaml
    attributes:
      allowed_cidrs: "{allowed_cidrs|default:10.0.0.0/8}"
```

### Example 2: Environment Composition

```yaml
# environments/production.yaml
metadata:
  environment: production
  version: 3.0.0
  
# Global parameters available to all bricks
parameters:
  region: us-east-1
  environment_type: production
  high_availability: true
  
composition:
  # Network layer
  - brick: network/vpc
    version: ">=2.0.0"
    parameters:
      cidr: "10.0.0.0/16"
      nat_gateways: 3
      
  # Database layer
  - brick: database/postgresql
    version: ">=2.1.0"
    parameters:
      instance_class: "db.r5.xlarge"
      storage_size: 500
      postgres_version: 14
      backup_retention: 30
      
  # Kubernetes layer
  - brick: kubernetes/eks
    version: ">=3.0.0"
    parameters:
      version: "1.27"
      node_groups:
        - name: general
          instance_types: ["m5.xlarge", "m5.2xlarge"]
          min_size: 3
          max_size: 10
          
  # Application layer
  - brick: applications/microservices
    version: ">=4.0.0"
    parameters:
      services:
        - name: api
          replicas: 3
          cpu: 2000m
          memory: 4Gi
        - name: worker
          replicas: 5
          cpu: 4000m
          memory: 8Gi
```

### Example 3: Feature Flag Integration

```yaml
# bricks/features/experimental.yaml
metadata:
  name: experimental-features
  version: 1.0.0
  
include_brick:
  # AI features
  - template: features/ai-integration.yaml
    when: "{feature_flags.ai_enabled}"
    
  # New monitoring stack
  - template: monitoring/new-stack.yaml
    when: "{feature_flags.new_monitoring}"
    
  # Canary deployment
  - template: deployment/canary.yaml
    when: "{feature_flags.canary_enabled}"
    attributes:
      canary_percentage: "{feature_flags.canary_percentage|default:10}"
```

## Testing and Validation

### Brick Testing Framework

```python
class BrickTester:
    """Test framework for bricks"""
    
    def test_brick(self, brick_path):
        """Comprehensive brick testing"""
        
        tests = [
            self.test_syntax,
            self.test_schema,
            self.test_composition,
            self.test_parameters,
            self.test_outputs,
            self.test_compatibility
        ]
        
        results = TestResults()
        
        for test in tests:
            result = test(brick_path)
            results.add(result)
            
            if result.failed and result.blocking:
                break
                
        return results
        
    def test_composition(self, brick_path):
        """Test brick composition"""
        
        brick = self.load_brick(brick_path)
        
        # Test with minimal parameters
        minimal = self.compose_with_minimal(brick)
        assert minimal.is_valid()
        
        # Test with all parameters
        full = self.compose_with_all_parameters(brick)
        assert full.is_valid()
        
        # Test invalid parameters
        with pytest.raises(ValidationError):
            self.compose_with_invalid(brick)
```

### Schema Validation

```yaml
# brick-schema.yaml
type: object
required: [metadata, configuration]
properties:
  metadata:
    type: object
    required: [name, version]
    properties:
      name:
        type: string
        pattern: "^[a-z0-9-]+$"
      version:
        type: string
        pattern: "^\\d+\\.\\d+\\.\\d+$"
      compatible_with:
        type: string
        
  configuration:
    type: object
    
  include_brick:
    type: array
    items:
      type: object
      properties:
        template:
          type: string
        when:
          type: string
        attributes:
          type: object
```

## Versioning and Release

### Brick Versioning Strategy

```python
class BrickVersionManager:
    """Manage brick versions"""
    
    def release_brick(self, brick_path, version_bump='patch'):
        """Release a new brick version"""
        
        brick = self.load_brick(brick_path)
        current_version = brick.metadata.version
        
        # Calculate new version
        new_version = self.bump_version(current_version, version_bump)
        
        # Update brick
        brick.metadata.version = new_version
        brick.metadata.released = datetime.now()
        
        # Validate compatibility
        self.validate_compatibility(brick)
        
        # Run tests
        test_results = BrickTester().test_brick(brick)
        if not test_results.passed:
            raise ReleaseError("Tests failed")
            
        # Tag and release
        self.tag_release(brick, new_version)
        self.publish_brick(brick)
        
        return new_version
```

## Migration from Legacy Configs

### The Migration Tool

```python
class ConfigToBrickMigrator:
    """Migrate legacy configs to bricks"""
    
    def migrate(self, legacy_config_path):
        """Convert legacy config to bricks"""
        
        legacy = self.load_legacy_config(legacy_config_path)
        
        # Analyze structure
        structure = self.analyze_structure(legacy)
        
        # Identify common patterns
        patterns = self.extract_patterns(structure)
        
        # Create bricks
        bricks = []
        for pattern in patterns:
            brick = self.create_brick_from_pattern(pattern)
            bricks.append(brick)
            
        # Create composition
        composition = self.create_composition(legacy, bricks)
        
        # Validate equivalence
        assert self.configs_equivalent(legacy, composition)
        
        return {
            'bricks': bricks,
            'composition': composition
        }
```

## Performance Optimizations

### Caching Strategy

```python
class BrickCache:
    """High-performance brick caching"""
    
    def __init__(self):
        self.memory_cache = {}
        self.redis_cache = Redis()
        self.s3_cache = S3Cache()
        
    def get_brick(self, name, version):
        """Multi-tier caching"""
        
        key = f"{name}:{version}"
        
        # L1: Memory cache
        if key in self.memory_cache:
            return self.memory_cache[key]
            
        # L2: Redis cache
        brick = self.redis_cache.get(key)
        if brick:
            self.memory_cache[key] = brick
            return brick
            
        # L3: S3 cache
        brick = self.s3_cache.get(key)
        if brick:
            self.warm_caches(key, brick)
            return brick
            
        # Load from source
        brick = self.load_from_source(name, version)
        self.warm_all_caches(key, brick)
        
        return brick
```

## Metrics and Monitoring

### Brick Usage Analytics

```python
class BrickAnalytics:
    """Track brick usage and performance"""
    
    def track_composition(self, manifest, result):
        """Track brick composition metrics"""
        
        metrics.send({
            'bricks.composition.count': len(manifest.composition),
            'bricks.composition.duration': result.duration,
            'bricks.composition.size': len(str(result.configuration)),
            'bricks.composition.success': result.success
        })
        
        # Track individual brick usage
        for brick in manifest.composition:
            metrics.send({
                'bricks.usage': 1,
                'brick.name': brick.name,
                'brick.version': brick.version
            })
            
    def identify_unused_bricks(self):
        """Find bricks that aren't being used"""
        
        all_bricks = self.repo.list_all_bricks()
        used_bricks = self.get_used_bricks_from_metrics()
        
        unused = set(all_bricks) - set(used_bricks)
        
        return unused
```

## Best Practices

### 1. Keep Bricks Small

```yaml
# ✅ Good: Focused brick
monitoring/prometheus:
  prometheus:
    retention: 30d
    storage: 100Gi

# ❌ Bad: Kitchen sink brick
everything:
  monitoring: ...
  logging: ...
  networking: ...
  # 500 more lines
```

### 2. Version Everything

```yaml
# ✅ Good: Explicit versions
composition:
  - brick: database/postgresql
    version: "2.1.0"  # Explicit version

# ❌ Bad: Latest version
composition:
  - brick: database/postgresql
    # No version = problems
```

### 3. Test Composition

```python
# Always test brick composition
def test_production_environment():
    manifest = load_manifest('environments/production.yaml')
    result = BrickEngine().compose(manifest)
    
    assert result.is_valid()
    assert 'kubernetes' in result.configuration
    assert result.configuration.kubernetes.version == '1.27'
```

## Conclusion

The Bricks system transformed configuration management from a copy-paste nightmare into a systematic, version-controlled, composable system. By treating configuration as LEGO blocks that can be:
- **Versioned** independently
- **Composed** flexibly
- **Tested** thoroughly
- **Reused** extensively

We achieved:
- **100% environment parity** when desired
- **90% reduction** in configuration lines
- **Zero configuration drift** in production
- **Minutes instead of days** for global updates
- **Confidence** in configuration changes

The key insight: Configuration is code, and it deserves the same engineering rigor.

---

*For implementation examples, see [Code Samples: Bricks](/code-samples/bricks-examples) and [Architecture: Configuration Management](/architecture/patterns/configuration.md)*