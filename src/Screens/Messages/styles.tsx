import { StyleSheet } from 'react-native';
import COLORS from '../../Utilities/Colors';
import { horizontalScale, verticalScale } from '../../Utilities/Metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    paddingVertical: verticalScale(16),
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    flexDirection: 'row',
    gap: horizontalScale(5),
  },
  headerIcons: {
    flexDirection: 'row',
    gap: horizontalScale(20),
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
    paddingHorizontal: horizontalScale(20),
    marginVertical: verticalScale(10),
  },
  scrollContainer: {
    paddingHorizontal: horizontalScale(15),
    flexDirection: 'row',
  },
  allmessageContainer: {},
  tabButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightPink,
    marginHorizontal: horizontalScale(5),
  },
  activeTabButton: {
    backgroundColor: COLORS.darkPink,
    borderColor: COLORS.darkPink,
  },
  plusIcon: {
    position: 'absolute',
    bottom: verticalScale(100),
    right: horizontalScale(20),
    zIndex: 1000,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  searchContainer: {
    paddingHorizontal: horizontalScale(20),
    overflow: 'hidden',
  },
});

export default styles;
