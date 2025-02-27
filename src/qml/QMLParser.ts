export class QMLParser {
    static parse(qmlString: string): QMLNode {
        try {
            console.log('Parsing QML string:', qmlString);
            const ast = JSON.parse(qmlString);
            console.log('Parsed AST:', ast);
            return this.createNode(ast);
        } catch (error) {
            console.error('Error parsing QML:', error);
            throw error;
        }
    }

    private static createNode(data: any): QMLNode {
        console.log('Creating node from data:', data);
        const node = new QMLNode(data.type);
        node.properties = data.properties || {};
        node.children = (data.children || []).map((child: any) => this.createNode(child));
        return node;
    }
}

export class QMLNode {
    properties: Record<string, any> = {};
    children: QMLNode[] = [];
    
    constructor(public type: string) {
        console.log('Created QML node of type:', type);
    }
}
