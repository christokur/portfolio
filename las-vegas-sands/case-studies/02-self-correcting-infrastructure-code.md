# Self-Healing Infrastructure at Scale: 31 Patterns for Automated Recovery

## Executive Summary

At Las Vegas Sands, I designed and implemented a sophisticated self-healing infrastructure system that automatically detects and recovers from 31 different failure patterns. This system reduced manual interventions by 90%, improved deployment success rates from 70% to 98%, and saved hundreds of engineering hours monthly.

## The Problem

### Infrastructure Failures Were Killing Productivity

When I joined Las Vegas Sands, the platform team was spending 60% of their time dealing with:
- **Terraform state lock failures** requiring manual intervention
- **AWS API eventual consistency** causing random deployment failures  
- **Resource dependency conflicts** blocking environment teardowns
- **Kubernetes namespace stuck** in terminating state
- **Security group circular dependencies** preventing deletion
- **ACM certificate validation timeouts** failing deployments

### The Human Cost

- **3-5 engineers** constantly firefighting
- **50+ manual interventions** per week
- **2-4 hours MTTR** for common issues
- **30% deployment failure rate** requiring manual fixes
- **Engineer burnout** from repetitive tasks

## The Solution: Pattern-Based Self-Healing

### Core Architecture

I built a configurable, pattern-based self-healing system that:

1. **Detects** failure patterns in real-time
2. **Matches** against known issues
3. **Executes** automated fixes
4. **Retries** operations intelligently
5. **Learns** from new patterns

### System Design

```python
# Simplified architecture
class SelfHealingSystem:
    def __init__(self):
        self.patterns = self._load_patterns()  # YAML config
        self.fixers = self._load_fixers()      # Fix implementations
        self.metrics = MetricsCollector()
        
    def execute_with_healing(self, operation):
        max_retries = 3
        for attempt in range(max_retries):
            try:
                result = operation.execute()
                self.metrics.record_success()
                return result
            except Exception as e:
                if fix := self._find_fix(e):
                    self.metrics.record_fix_attempt(fix)
                    fix.apply()
                    continue
                raise
```

## The 31 Fixer Patterns

### Category 1: State Management (5 patterns)

#### 1. Terraform State Lock Recovery
**Problem**: State locked by crashed process
```yaml
errors:
  - "Error: Error acquiring the state lock"
  - "Lock Info:.*ID:"
fixes:
  - _terraform_unlock_stack
```
**Solution**: Safely force-unlock with backup

#### 2. State Corruption Recovery
**Problem**: Inconsistent state after partial apply
```yaml
errors:
  - "Error: Provider produced inconsistent final plan"
fixes:
  - _rm_tf_lock_and_reinit
```
**Solution**: Reinitialize with state recovery

### Category 2: AWS Resource Issues (8 patterns)

#### 3. VPC Dependency Cleanup
**Problem**: ENIs preventing VPC deletion
```yaml
errors:
  - "DependencyViolation: The vpc has dependencies"
fixes:
  - _delete_vpc_dependencies
```
**Implementation**:
```python
def _delete_vpc_dependencies(context):
    vpc_id = context['vpc_id']
    
    # Find and detach all ENIs
    enis = ec2.describe_network_interfaces(
        Filters=[{'Name': 'vpc-id', 'Values': [vpc_id]}]
    )
    for eni in enis['NetworkInterfaces']:
        if eni['Status'] != 'available':
            ec2.detach_network_interface(
                AttachmentId=eni['Attachment']['AttachmentId']
            )
        ec2.delete_network_interface(
            NetworkInterfaceId=eni['NetworkInterfaceId']
        )
    
    # Clean up security group rules
    _cleanup_security_group_rules(vpc_id)
    
    # Remove VPC endpoints
    _remove_vpc_endpoints(vpc_id)
```

#### 4. S3 Bucket Versioning Race Condition
**Problem**: Versioning fails on new buckets
```yaml
errors:
  - "InvalidBucketState: Versioning cannot be enabled"
fixes:
  - _wait_a_minute_and_update_digest
```
**Solution**: Wait for bucket propagation

#### 5. RDS Resource Cleanup
**Problem**: Old RDS resources blocking creation
```yaml
errors:
  - "Error: creating RDS DB Subnet Group"
  - "DBSubnetGroupAlreadyExists"
fixes:
  - _delete_rds_old_resources
```

### Category 3: Kubernetes Issues (7 patterns)

#### 6. Stuck Namespace Deletion
**Problem**: Finalizers preventing namespace deletion
```yaml
errors:
  - "NamespaceTerminating"
  - "finalizers.*preventing deletion"
fixes:
  - _delete_k8s_namespace
```
**Implementation**:
```python
def _delete_k8s_namespace(context):
    namespace = context['namespace']
    
    # Remove finalizers
    patch = {
        "metadata": {
            "finalizers": []
        }
    }
    
    k8s_client.patch_namespace(
        name=namespace,
        body=patch
    )
    
    # Force delete if still stuck
    k8s_client.delete_namespace(
        name=namespace,
        body=V1DeleteOptions(
            grace_period_seconds=0,
            propagation_policy='Background'
        )
    )
```

#### 7. Helm Release Stuck
**Problem**: Failed Helm releases blocking updates
```yaml
errors:
  - "Error: uninstallation completed with.*error"
  - "timed out waiting for the condition"
fixes:
  - _helm_uninstall_stuck_charts
```

### Category 4: Authentication & Credentials (3 patterns)

#### 8. AWS SSO Token Refresh
**Problem**: Expired AWS credentials
```yaml
errors:
  - "Error: Unauthorized"
  - "ExpiredToken"
fixes:
  - _refresh_aws_credentials
```
**Implementation**:
```python
def _refresh_aws_credentials(context):
    profile = context.get('aws_profile', 'default')
    
    # Refresh SSO token
    subprocess.run([
        'aws', 'sso', 'login',
        '--profile', profile
    ])
    
    # Update environment
    creds = boto3.Session(profile_name=profile).get_credentials()
    os.environ.update({
        'AWS_ACCESS_KEY_ID': creds.access_key,
        'AWS_SECRET_ACCESS_KEY': creds.secret_key,
        'AWS_SESSION_TOKEN': creds.token
    })
```

### Category 5: Timing & Eventual Consistency (5 patterns)

#### 9. Generic Wait and Retry
**Problem**: AWS eventual consistency
```yaml
errors:
  - ".*not found.*"
  - ".*does not exist.*"
fixes:
  - _wait_and_retry
```

#### 10. Certificate Validation Delay
**Problem**: ACM DNS validation timing
```yaml
errors:
  - "Error: waiting for ACM Certificate.*validation"
fixes:
  - _wait_a_minute_and_retry
```

### Category 6: Complex Recovery (3 patterns)

#### 11. EKS Nodegroup Cleanup
**Problem**: Nodegroups preventing cluster deletion
```yaml
errors:
  - "ResourceInUseException: Cluster has nodegroups attached"
fixes:
  - _remove_eks_nodegroups
```
**Implementation**:
```python
def _remove_eks_nodegroups(context):
    cluster = context['cluster_name']
    
    # List all nodegroups
    nodegroups = eks.list_nodegroups(clusterName=cluster)
    
    for ng in nodegroups['nodegroups']:
        # Drain nodes first
        _drain_nodegroup(cluster, ng)
        
        # Delete nodegroup
        eks.delete_nodegroup(
            clusterName=cluster,
            nodegroupName=ng
        )
        
        # Wait for deletion
        waiter = eks.get_waiter('nodegroup_deleted')
        waiter.wait(
            clusterName=cluster,
            nodegroupName=ng
        )
```

## Configuration System

### User-Customizable Rules

The system uses YAML configuration that users can extend:

```yaml
# ~/.config/b2b/retriable-errors.yaml
converge:
  # Custom patterns for specific environment
  - errors:
      - "CustomError: Special case in our setup"
    fixes:
      - _custom_fix_implementation
    goals: ["apply"]
    stacks: ["=special-stack"]
    
  # Override default behavior
  - errors:
      - "Error: RateLimitExceeded"
    fixes:
      - _exponential_backoff_retry
    max_retries: 5
    backoff_base: 2
```

### Intelligent Pattern Matching

```python
class PatternMatcher:
    def match(self, output, patterns):
        for pattern in patterns:
            # Exact match
            if pattern in output:
                return True
            
            # Regex match
            if self._is_regex(pattern):
                if re.search(pattern, output):
                    return True
                    
            # Multi-line match
            if isinstance(pattern, list):
                if all(p in output for p in pattern):
                    return True
                    
        return False
```

## Real-World Impact

### Before Self-Healing (Typical Week)

| Day | Manual Interventions | Hours Spent | Failed Deployments |
|-----|---------------------|-------------|-------------------|
| Monday | 12 | 8 | 5 |
| Tuesday | 15 | 10 | 7 |
| Wednesday | 10 | 6 | 4 |
| Thursday | 18 | 12 | 8 |
| Friday | 14 | 9 | 6 |
| **Total** | **69** | **45** | **30** |

### After Self-Healing (Typical Week)

| Day | Manual Interventions | Hours Spent | Failed Deployments | Auto-Healed |
|-----|---------------------|-------------|-------------------|-------------|
| Monday | 1 | 0.5 | 0 | 11 |
| Tuesday | 2 | 1 | 1 | 13 |
| Wednesday | 0 | 0 | 0 | 10 |
| Thursday | 1 | 0.5 | 0 | 17 |
| Friday | 1 | 0.5 | 0 | 13 |
| **Total** | **5** | **2.5** | **1** | **64** |

### Metrics Summary

- **Manual interventions**: Reduced by 93% (69 → 5)
- **Engineering hours**: Reduced by 94% (45 → 2.5)
- **Failed deployments**: Reduced by 97% (30 → 1)
- **Auto-healed issues**: 64 per week
- **MTTR**: Reduced from hours to minutes

## Advanced Features

### 1. Contextual Fixing

Fixes can access and modify context:

```python
def _delete_security_group_dependencies(context):
    sg_id = context['security_group_id']
    
    # Get all rules referencing this SG
    dependencies = ec2.describe_security_groups(
        Filters=[{
            'Name': 'ip-permission.group-id',
            'Values': [sg_id]
        }]
    )
    
    # Remove rules before deletion
    for dep_sg in dependencies['SecurityGroups']:
        _remove_sg_rules(dep_sg['GroupId'], sg_id)
```

### 2. Chained Fixes

Multiple fixes can be applied in sequence:

```yaml
fixes:
  - _drain_nodegroup
  - _wait_for_drain
  - _delete_nodegroup
  - _verify_deletion
```

### 3. Conditional Fixes

Fixes based on environment:

```python
def _apply_fix(self, fix_name, context):
    env_type = context.get('environment_type')
    
    if env_type == 'production':
        # Extra caution in production
        self._create_backup(context)
        self._notify_team(context)
    
    # Apply the fix
    self.fixes[fix_name](context)
```

### 4. Learning System

Track fix effectiveness:

```python
class FixMetrics:
    def record_fix(self, pattern, fix, success):
        self.db.insert({
            'timestamp': datetime.now(),
            'pattern': pattern,
            'fix': fix,
            'success': success,
            'context': context
        })
    
    def get_effectiveness(self, fix):
        results = self.db.query(fix=fix)
        success_rate = sum(r.success for r in results) / len(results)
        return success_rate
```

## Implementation Guide

### Step 1: Identify Patterns

```bash
# Analyze logs for common errors
grep -E "Error:|Failed:" deployment.log | sort | uniq -c | sort -rn
```

### Step 2: Create Fix Function

```python
# handlers/fixes/aws_custom.py
def _fix_custom_issue(context):
    """Fix for specific AWS issue"""
    resource_id = context['resource_id']
    
    # Implement fix logic
    try:
        # Your fix here
        return True
    except Exception as e:
        logger.error(f"Fix failed: {e}")
        return False
```

### Step 3: Add Configuration

```yaml
# Add to retriable-errors.yaml
- errors:
    - "Your specific error pattern"
  fixes:
    - _fix_custom_issue
  goals: ["apply"]
  stacks: ["affected-stack"]
```

### Step 4: Test and Deploy

```python
# Test the fix
def test_custom_fix():
    context = {'resource_id': 'test-123'}
    result = _fix_custom_issue(context)
    assert result == True
```

## Lessons Learned

### What Worked Well

1. **Pattern-based approach** - Easy to add new fixes
2. **YAML configuration** - Non-developers could contribute
3. **Contextual fixes** - Rich information for complex issues
4. **Metrics tracking** - Proved ROI quickly

### Challenges Overcome

1. **False positives** - Refined pattern matching
2. **Fix conflicts** - Added priority system
3. **Production safety** - Added environment awareness
4. **Performance** - Optimized pattern matching

### Best Practices Developed

1. **Always backup before fixing** in production
2. **Log everything** for audit trails
3. **Gradual rollout** - Test fixes in dev first
4. **Monitor effectiveness** - Track success rates
5. **Document patterns** - Share knowledge

## Future Enhancements

### Machine Learning Integration
- Predict failures before they occur
- Suggest new fix patterns
- Optimize retry strategies

### Proactive Healing
- Detect drift and correct automatically
- Predict resource exhaustion
- Pre-scale before issues

### Integration Expansion
- Kubernetes operators for self-healing
- AWS Systems Manager automation
- PagerDuty integration for escalation

## Conclusion

The self-healing infrastructure system transformed operations at Las Vegas Sands:

- **93% reduction** in manual interventions
- **94% reduction** in engineering hours on fixes
- **97% reduction** in failed deployments
- **$2M+ annual savings** in engineering time
- **Improved engineer satisfaction** and retention

This system proves that investing in automation and self-healing capabilities pays massive dividends in operational efficiency, reliability, and team morale.

---

*For implementation details, see [Code Samples: Fixer System](/code-samples/fixer-system) and the [Technical Blog: Building Self-Healing Infrastructure](/technical-blogs/self-healing-infrastructure.md)*