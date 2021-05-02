const NB_RETRIES = 200;

export class TravellingSalesman {
  generateData({nbCities, nbClusters, clusterRay}) {
    if (isNaN(nbCities) || isNaN(nbClusters) || isNaN(clusterRay)) {
      throw new Error('Invalid params.');
    }
    const clusters = this.generateClusters(nbClusters, clusterRay);
    const cities = [];
    for (let i = 0; i < nbCities; ++i) {
      const clusterId = Math.floor(Math.random() * nbClusters);
      cities.push(this.generateCity(clusters[clusterId], clusterRay));
      clusters[clusterId].nbCities += 1;
    }
    return {
      clusters,
      cities,
    };
  }

  generateClusters(nbClusters, clusterRay) {
    const clusters = [];
    for (let i = 0; i < nbClusters; ++i) {
      let it = 0;
      while (it < NB_RETRIES) {
        const cluster = {
          id: i,
          nbCities: 0,
          x: Math.random(),
          y: Math.random(),
        }
        let valid = true;
        for (const c of clusters) {
          if (this.distance(cluster, c) < 2 * clusterRay) {
            valid = false;
          }
        }
        if (valid) {
          clusters.push(cluster);
          break;
        }
        it += 1;
      }
      if (it === NB_RETRIES) {
        throw new Error(
          `Couldn't generate data, please try with less clusters or a shorter cluster ray.`);
      }
    }
    return clusters;
  }

  generateCity(cluster, clusterRay) {
    while (true) {
      const city = {
        clusterId: cluster.id,
        x: cluster.x + (2 * Math.random() - 1) * clusterRay,
        y: cluster.y + (2 * Math.random() - 1) * clusterRay,
      }
      if (this.distance(cluster, city) > clusterRay) {
        continue;
      }
      if (city.x < 0 || city.x > 1 || city.y < 0 || city.y > 1) {
        continue;
      }
      return city;
    }
  }

  distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }
}
