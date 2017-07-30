import org.jsweet.transpiler.extension.PrinterAdapter;

public class BitwigAdapter extends PrinterAdapter {
    public BitwigAdapter(PrinterAdapter parent) {
        super(parent);
        addTypeMapping(java.util.UUID.class.getName(), "string");
    }
}