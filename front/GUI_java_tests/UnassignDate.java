import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;

public class UnassignDate {
    private WebDriver driver;
    private String baseUrl;
    private boolean acceptNextAlert = true;
    private StringBuffer verificationErrors = new StringBuffer();

    @Before
    public void setUp() throws Exception {
        driver = new ChromeDriver();
        baseUrl = "https://www.katalon.com/";
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
    }

    @Test
    public void testUnassignDate() throws Exception {
        driver.get("http://localhost:3000/");
        driver.findElement(By.xpath("//div[@id='App1']/div/button/div/div")).click();
        driver.findElement(By.id("nextDayIcon")).click();
        assertEquals("Odkurzanie", driver.findElement(By.xpath("//div[@id='App1']/div[2]/div[3]/div[2]/table/tbody/tr/td")).getText());
        driver.findElement(By.cssSelector("#assignIcon > path")).click();
        assertEquals("Odkurzanie", driver.findElement(By.xpath("//div[@id='App1']/div[2]/div[2]/div[2]/table/tbody/tr/td[2]")).getText());
        driver.findElement(By.id("unassignIcon")).click();
        assertEquals("Odkurzanie", driver.findElement(By.xpath("//div[@id='App1']/div[2]/div[3]/div[2]/table/tbody/tr[5]/td")).getText());
    }

    @After
    public void tearDown() throws Exception {
        driver.quit();
        String verificationErrorString = verificationErrors.toString();
        if (!"".equals(verificationErrorString)) {
            fail(verificationErrorString);
        }
    }

    private boolean isElementPresent(By by) {
        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private boolean isAlertPresent() {
        try {
            driver.switchTo().alert();
            return true;
        } catch (NoAlertPresentException e) {
            return false;
        }
    }

    private String closeAlertAndGetItsText() {
        try {
            Alert alert = driver.switchTo().alert();
            String alertText = alert.getText();
            if (acceptNextAlert) {
                alert.accept();
            } else {
                alert.dismiss();
            }
            return alertText;
        } finally {
            acceptNextAlert = true;
        }
    }
}
