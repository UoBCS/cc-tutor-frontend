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

export default strings;
