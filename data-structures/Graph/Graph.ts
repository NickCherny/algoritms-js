import { IEdge } from './Edge';
import { IVertex } from './Vertex';

export interface IGraph<T> {
  addVertex: (vertex: IVertex<T>) => number
  getEdgeByKey: (edge: IEdge<T>) => IEdge<T>|null
  addEdge: (edge: IEdge<T>) => this
  calculateWeight: () => number
  neighborsForKey: (key: string) => Array<IVertex<T>>|[]
  toString: () => string
};

class Graph<T> implements IGraph<T> {
  private vertices: { [key: string]: IVertex<T> } = {};
  private edges: { [key: string]: IEdge<T> } = {};
  private isDirected: boolean;

  constructor(isDirected: boolean = false) {
    this.isDirected = isDirected;
  }

  addVertex(vertex: IVertex<T>) {
    this.vertices[vertex.key] = vertex;

    return Object.keys(this.vertices).length - 1;
  }

  getVertexByKey(key: string) {
    return this.vertices[key];
  }

  addEdge(edge: IEdge<T>) {
    const { from, to } = edge;
    let startVertex: IVertex<T>|null = this.getVertexByKey(from.key);
    let endVertex: IVertex<T>|null = this.getVertexByKey(to.key);

    if (!startVertex) {
      this.addVertex(from);
      startVertex = from;
    }

    if (!endVertex) {
      this.addVertex(to);
      endVertex = to;
    }

    if (this.edges[edge.getKey()]) {
      throw new Error('Edge has already been added before');
    } else {
      this.edges[edge.getKey()] = edge;
    }

    if (this.isDirected) {
      startVertex.addEdge(edge);
    } else {
      startVertex.addEdge(edge);
      endVertex.addEdge(edge);
    }

    return this;
  }

  getEdgeByKey(edge: IEdge<T>) {
    return this.edges[edge.getKey()];
  }

  deleteEdge(edge: IEdge<T>) {
    if (this.edges[edge.getKey()]) {
      delete this.edges[edge.getKey()];
    } else {
      throw new Error('Edge not found in graph');
    }

    const startVertex = this.getVertexByKey(edge.from.key);
    const endVertex = this.getVertexByKey(edge.to.key);

    startVertex.deleteEdge(edge);
    endVertex.deleteEdge(edge);
  }

  calculateWeight() {
    return Object
      .keys(this.edges)
      .map(key => this.edges[key])
      .reduce((acc, { weight }) => acc + weight, 0);
  }

  neighborsForKey(key: string) {
    return this.vertices[key] ? this.vertices[key].getNeighbors() : [];
  }

  toString() {
    return Object.keys(this.vertices).toString();
  }
}

export default Graph;
