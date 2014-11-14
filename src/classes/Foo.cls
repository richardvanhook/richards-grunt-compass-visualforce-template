public class Foo{
    public Integer count {get;private set;}
    public Foo(){ count = 0; }
    public PageReference doIncrement(){ count++; return null; }
}