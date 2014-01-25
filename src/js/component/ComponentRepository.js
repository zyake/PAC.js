/**
 * コンポーネントを一元的に管理するためのリポジトリ。
 *
 * コンポーネントはファクトリ単位で登録し、コンポーネントが
 * 初めて取得されるタイミングで生成され、以後キャッシュされる。
 * そのため、コンポーネントのモデルとしてはシングルトンのみをサポートする。
 *
 * ファクトリ内から他のコンポーネントを参照したい場合は、
 * ファクトリ内のthisスコープでgetメソッドを呼ぶことで、
 * 連鎖的に依存関係を解決することができる。
 *
 * ■例
 * var repository = new ComponentRepository();
 * repository.addFactory("id", function() { return "ID-1" });
 * repository.addFactory("defaultName", function() { return this.get("id") + "-001" });
 *
 * // ID1-001が表示される
 * alert(repository.get("defaultName"));
 */
function ComponentRepository(parent) {
    this.parent = parent;
    this.components = {};
    this.factories = {};
}

ComponentRepository.prototype.addFactory = function(key, factory) {
    var duplicatedKey = this.factories[key] != null;
    if ( duplicatedKey ) {
        throw new Error("duplicated key: key=" + key);
    }

    this.factories[key] = factory;
}

ComponentRepository.prototype.get = function(key, args) {
    var existsComponent = this.components[key] != null;
    if ( existsComponent ) {
        var component = this.components[key];
        return component;
    }

    var targetFactory = this.factories[key];
    if ( targetFactory  == null ) {
        if ( this.parent == null ) {
            throw new Error("target factory not found: key=" + key);
        }

        var component = this.parent.get(key, args);
        if ( component == null ){
            throw new Error("target factory not found: key=" + key);
        }
        return component;
    }
    var newComponent = targetFactory.call(this, args);
    this.components[key] = newComponent;

    return newComponent;
}