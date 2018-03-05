const strings = {};

strings.javaEditorInitialContent =
`import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class |{className}|
{
    @DisplayName("Test workings of dummy")
    @Test
    public void testDummy()
    {
        assertTrue(true, "Dummy test");
    }
}`
;

strings.buildAst = {};

strings.buildAst.exampleFileNames = [
    'Node.java',
    'Expression.java',
    'SExpression.java',
    'LExpression.java',
    'BExpression.java'
];

strings.buildAst.exampleFileContents = [
`import com.cctutor.app.ast.BaseNode;

public class Node extends BaseNode<String, Expression> {

    /*
     * Available variables:
     *
     * String value;
     * BaseNode<String> parent;
     * ArrayList<BaseNode<String>> children;
     */

    public Node(String filename, Class<?> classObj) throws Throwable {
        super(filename, classObj);
    }

    public Node(String value) {
        super(value);
    }

    /*
     * Implement this
     */
    public Expression toAst() {
        if (value.equals("s")) {
            return new SExpression(children.get(0).toAst(), children.get(1).toAst());
        } else if (value.equals("l")) {
            return new LExpression(value);
        } else {
            return new BExpression(value);
        }
    }
}`,

`public class Expression {

}`,

`public class SExpression extends Expression {
    public Expression expr1;
    public Expression expr2;

    public SExpression(Expression expr1, Expression expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }
}`,

`public class LExpression extends Expression {
    public String _value;

    public LExpression(String value) {
        this._value = value;
    }
}`,

`public class BExpression extends Expression {
    public String _value;

    public BExpression(String value) {
        this._value = value;
    }
}`

];

export default strings;
