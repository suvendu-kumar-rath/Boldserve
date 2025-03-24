import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import boldtribeLogo from '../assets/BoldTribe_Logo-removebg-preview.png';

// Register a font to ensure text renders properly
Font.register({
    family: 'Helvetica',
    src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QIFqPfE.ttf'
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 12,
        lineHeight: 1.5
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 10
    },
    logo: {
        width: 150,
        height: 'auto',
        objectFit: 'contain'
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold'
    },
    section: {
        margin: 10,
        padding: 10
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    paragraph: {
        marginBottom: 10
    }
});

const PDFTemplate = ({ title, content }) => {
    // Split content into sections for better formatting
    const contentSections = content.split('\n\n');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                    <Image source={boldtribeLogo} style={styles.logo} />
                </View>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.section}>
                    {contentSections.map((section, index) => (
                        <Text key={index} style={styles.paragraph}>
                            {section}
                        </Text>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PDFTemplate;