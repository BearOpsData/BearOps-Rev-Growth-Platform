# Server Specifications Guide

## Recommended: CPX32 (Best Balance)

### CPX22 Specifications
- **vCPU:** 2 cores
- **RAM:** 4GB
- **SSD:** 80GB
- **Price:** ~€5-7/month
- **Traffic:** 20TB included

### CPX32 Specifications (Recommended)
- **vCPU:** 4 cores
- **RAM:** 8GB
- **SSD:** 160GB
- **Price:** ~€10-12/month
- **Traffic:** 20TB included

### Why CPX32?

**For Your Use Case:**
- ✅ **Coolify overhead:** ~2-4GB RAM
- ✅ **Next.js app:** ~1-2GB RAM
- ✅ **Docker containers:** ~2-4GB RAM
- ✅ **System overhead:** ~1GB RAM
- ✅ **Available:** ~1-3GB free
- ✅ **Better performance:** Faster builds and deployments
- ✅ **Production ready:** Handles 10-20+ users easily

**Performance Benefits:**
- Faster Docker builds
- More concurrent users
- Better for production workloads
- Room for growth

### Resource Breakdown

**CPX32 (8GB RAM) - Recommended:**
- Coolify: ~2-4GB
- Your Next.js app: ~1-2GB
- System overhead: ~1GB
- **Available:** ~1-3GB free
- **Perfect for:** Production, 10-20+ users, good balance

**CPX22 (4GB RAM) - Budget Option:**
- Coolify: ~2-4GB
- Your Next.js app: ~1-2GB
- System overhead: ~0.5GB
- **Available:** ~0-0.5GB free (tight!)
- **Perfect for:** Demo, testing, 2-5 users, minimal usage

## Comparison

| Feature | CPX22 | CPX32 |
|---------|-------|-------|
| vCPU | 2 | 4 |
| RAM | 4GB | 8GB |
| SSD | 80GB | 160GB |
| Price/month | ~€5-7 | ~€10-12 |
| Best for | Demo/Testing | **Production** ⭐ |
| Users | 2-5 | 10-20+ |
| Apps | 1 | 2-3 |
| Performance | Good | **Excellent** ⭐ |

## Recommendation

**⭐ CPX32 is the recommended choice** - Best balance of performance and cost

**For demo with 2 users:** CPX22 is sufficient (~€5-7/month)
**For production:** **CPX32 is recommended** (~€10-12/month) ⭐

**CPX32 gives you:**
- 2x more RAM than CPX22 (8GB vs 4GB)
- 2x more CPU (4 vs 2)
- 2x more storage (160GB vs 80GB)
- Excellent performance
- Room to grow
- Only ~€5 more than CPX22

**Cost comparison:**
- CPX22 → CPX32: +~€5/month (~$5.50)

## Can You Start with CPX22?

Yes! You can:
1. Start with CPX22 for demo
2. Upgrade to CPX32 later (takes ~5 minutes)
3. No downtime during upgrade
4. Data is preserved

## Upgrade Path

Hetzner makes it easy to upgrade:
1. In Hetzner Cloud Console
2. Select your server
3. Click "Resize"
4. Choose CPX32
5. Server restarts (2-3 minutes)
6. Done!

## Decision Matrix

**Choose CPX22 if:**
- Budget is very tight
- Only for demo/testing
- 2-5 users max
- Single application
- Temporary deployment
- **Note:** 4GB RAM is tight for Coolify + Docker + Next.js

**Choose CPX32 if:** ⭐ **RECOMMENDED**
- Production deployment
- Want excellent performance
- Planning for growth
- 10-20+ users
- Multiple applications possible
- Best price/performance ratio
- **This is the sweet spot!**
- 8GB RAM gives comfortable headroom

## Bottom Line

**⭐ CPX32 is the recommended choice** - Perfect balance of performance, cost, and headroom for growth. 8GB RAM is much more comfortable for Coolify + Docker + your Next.js app.

**CPX22 works** for demo if budget is tight, but 4GB RAM is quite tight for Coolify + Docker + Next.js. You'll have minimal headroom.

**CPX32 is worth the extra ~€5/month** for production - the 2x RAM and CPU make a significant difference in performance and reliability.

